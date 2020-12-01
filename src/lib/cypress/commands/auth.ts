import {isFunction, isString, isNil} from 'lodash';
import 'cypress-wait-until';
import 'cypress-localstorage-commands';
import * as path from 'path';
import * as Joi from '@hapi/joi';
import * as Json5 from 'json5';
import './env';

export interface AuthCookie extends Cypress.SetCookieOptions {
  key: string;
}

export interface AuthConfig {
  authUrl: string;
  cookies: AuthCookie[];
  secretStore: string;
  domains: string[];
}

export interface AuthStoreOptions {
  configName: string;
  configBasePath?: string;
  authCallback?: () => Cypress.Chainable<any> | void;
}

export interface AuthEnsureOptions extends AuthStoreOptions {
  customAuth?: (...args: any) => Cypress.Chainable<void>;
}

export const AuthConfigScheme = Joi.object({
  cookies: Joi.array().items({key: Joi.string().required()}).required(),
  authUrl: Joi.string().required(),
  secretStore: Joi.string().required(),
  domains: Joi.array().items(Joi.string().required()).required(),
}).unknown();

export interface AuthSecrets {
  cookies: {
    [key: string]: string;
  };
}

export const AuthSecretsScheme = Joi.object({
  cookies: Joi.object().required(),
});

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export interface Chainable<Subject> {
      authLoadConfig(options: AuthStoreOptions): Chainable<AuthConfig>;
      authLoadSecrets(options: AuthStoreOptions): Chainable<{loaded: boolean; authUrl: string}>;
      authSaveSecrets(options: AuthStoreOptions): Chainable<void>;
      authClearSecrets(options: AuthStoreOptions): Chainable<void>;
      authManualAuth(authUrl: string): Chainable<void>;
      authEnsureAuth(options: AuthEnsureOptions): Chainable<void>;
    }
  }
}

Cypress.Commands.add('authManualAuth', (url: string) => {
  const {HAKONIWA_CYPRESS_UNLIMIT_TIMEOUT} = Cypress.config('env');
  cy.visit(url);
  const confirmOptions = {
    auth: false,
    interrupt: true,
  };
  const authedConfirm = (newUrl: string) => {
    if (newUrl === url) {
      return;
    }
    confirmOptions.auth = confirm('auth successfully?');
    if (!confirmOptions.auth) {
      confirmOptions.interrupt = confirm('interrupt?');
      if (confirmOptions.interrupt) {
        throw new Error('interrupt auth');
      }
    } else {
      cy.removeListener('url:changed', authedConfirm);
    }
  };
  cy.on('url:changed', authedConfirm);
  cy.waitUntil(() => confirmOptions.auth, {
    timeout: HAKONIWA_CYPRESS_UNLIMIT_TIMEOUT,
  });
});

Cypress.Commands.add('authEnsureAuth', ({configName, configBasePath, customAuth, authCallback}: AuthEnsureOptions) => {
  cy.authLoadSecrets({configName, configBasePath, authCallback}).then(({loaded, authUrl}) => {
    if (!loaded) {
      customAuth && isFunction(customAuth) ? customAuth() : cy.authManualAuth(authUrl);
      cy.authSaveSecrets({configName, configBasePath});
      authCallback && isFunction(authCallback) && authCallback();
    } else {
      const reAuth = (newUrl: string) => {
        if (newUrl.indexOf(authUrl) !== -1) {
          const c = confirm('auth failed, clear secrets?');
          cy.removeListener('url:changed', reAuth);
          if (c) {
            cy.authClearSecrets({configName, configBasePath, authCallback});
            throw new Error('interrupt auth');
          }
        }
      };
      cy.on('url:changed', reAuth);
    }
  });
});

Cypress.Commands.add('authLoadConfig', ({configName, configBasePath}: AuthStoreOptions) => {
  if (!configBasePath) {
    const {HAKONIWA_AUTH_DIR} = Cypress.config('env');
    configBasePath = HAKONIWA_AUTH_DIR as string;
  }
  const configPath = path.join(configBasePath, `${configName}.json`);
  return cy.readFile(configPath, 'utf-8').then(config => {
    const {error, value} = AuthConfigScheme.validate(config);
    if (error) {
      throw error;
    }
    return value as AuthConfig;
  });
});

Cypress.Commands.add('authLoadSecrets', (options: AuthStoreOptions) => {
  return cy.authLoadConfig(options).then(config => {
    const {cookies: cookiesOptions, authUrl, secretStore, domains} = config;
    const res = {
      toEnd: false,
      loaded: false,
      authUrl,
    };
    cy.task('fsReadFileOrNull', secretStore).then(secretsContent => {
      if (!isString(secretsContent)) {
        res.loaded = false;
        res.toEnd = true;
      } else {
        const {error, value: secrets} = AuthSecretsScheme.validate(Json5.parse(secretsContent));
        if (error) {
          throw error;
        }
        for (const d of domains) {
          for (const co of cookiesOptions) {
            if (!isNil(secrets.cookies[co.key])) {
              cy.setCookie(co.key, secrets.cookies[co.key].toString(), Object.assign(co, {domain: d}));
            }
          }
        }
        options.authCallback && isFunction(options.authCallback) && options.authCallback();
        res.loaded = true;
        res.toEnd = true;
      }
    });
    cy.waitUntil(() => res.toEnd);
    return cy.wrap(res);
  });
});

Cypress.Commands.add('authClearSecrets', (options: AuthStoreOptions) => {
  return cy.authLoadConfig(options).then(config => {
    const {secretStore} = config;
    cy.log(secretStore);
    cy.task('removeFile', secretStore);
  });
});

Cypress.Commands.add('authSaveSecrets', (options: AuthStoreOptions) => {
  cy.authLoadConfig(options).then(config => {
    const {cookies: cookiesOptions, secretStore} = config;
    const secrets: AuthSecrets = {
      cookies: {},
    };
    let setCounter = 0;
    for (const co of cookiesOptions) {
      cy.getCookie(co.key).then(c => {
        if (c) {
          secrets.cookies[co.key] = c.value;
        }
        setCounter++;
      });
    }
    cy.waitUntil(() => setCounter >= cookiesOptions.length);
    cy.writeFile(secretStore, secrets, 'utf8');
  });
});
