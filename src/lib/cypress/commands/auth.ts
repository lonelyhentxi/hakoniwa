import { isFunction, isString, isNil } from 'lodash';
import 'cypress-wait-until';
import 'cypress-localstorage-commands';
import * as path from 'path';
import * as Joi from '@hapi/joi';
import * as Json5 from 'json5';
import { HAKONIWA_CYPRESS_UNLIMIT_TIMEOUT } from '../../../constants/constants.browser';

export interface CyStoreAuthCookie extends Cypress.SetCookieOptions {
    key: string;
}

export interface CyStoreAuthConfig {
    authUrl: string,
    cookies: CyStoreAuthCookie[],
    secretStore: string,
    domains: string[],
}

export interface CyStoreAuthOptions {
    configName: string;
    configBasePath?: string;
    authCallback?: () => Cypress.Chainable<any> | void;  
}

export interface CyEnsureAuthOptions
    extends CyStoreAuthOptions {
    customAuth?: (...args: any) => Cypress.Chainable<void>,
}

export const CyStoreAuthConfigScheme = Joi.object({
    cookies: Joi.array().items({ key: Joi.string().required()}).required(),
    authUrl: Joi.string().required(),
    secretStore: Joi.string().required(),
    domains: Joi.array().items(Joi.string().required()).required(),
}).unknown();

export interface CyStoreAuthSecret {
    cookies: {
        [key: string]: string;
    }
}

export const CyStoreAuthSecretScheme = Joi.object({
    cookies: Joi.object().required(),
})

declare global {
    namespace Cypress {
        export interface Chainable<Subject> {
            loadAuthConfig(options: CyStoreAuthOptions): Chainable<CyStoreAuthConfig>;
            loadAuth(options: CyStoreAuthOptions): Chainable<{loaded: boolean, authUrl: string}>;
            saveAuth(options: CyStoreAuthOptions): Chainable<void>;
            manualAuth(authUrl: string): Chainable<void>;
            ensureAuth(options: CyEnsureAuthOptions): Chainable<void>;
        }
    }
}

Cypress.Commands.add('manualAuth', (url: string) => {
    cy.visit(url);
    const confirmOptions = {
        auth: false,
        interrupt: true,
    };
    const authedConfirm = (newUrl: string) => {
        if(newUrl===url) {
            return;
        }
        confirmOptions.auth = confirm("auth successfully?");
        if (!confirmOptions.auth) {
            confirmOptions.interrupt = confirm("interrupt?");
            if (confirmOptions.interrupt) {
                throw new Error("interrupt auth")
            }
        } else {
            cy.removeListener('url:changed', authedConfirm);
        }
    }
    cy.on('url:changed', authedConfirm);
    cy.waitUntil(() => confirmOptions.auth, {
        timeout: HAKONIWA_CYPRESS_UNLIMIT_TIMEOUT,
    });
});

Cypress.Commands.add('ensureAuth', ({ configName, configBasePath, customAuth, authCallback }: CyEnsureAuthOptions) => {
    cy.loadAuth({ configName, configBasePath, authCallback }).then(({loaded, authUrl}) => {
        if (!loaded) {
            (customAuth && isFunction(customAuth) ? customAuth() : cy.manualAuth(authUrl));
            cy.saveAuth({ configName, configBasePath });
            authCallback && isFunction(authCallback) && authCallback();
        }
    });
});

Cypress.Commands.add('loadAuthConfig', ({ configName, configBasePath }: CyStoreAuthOptions) => {
    if (!configBasePath) {
        configBasePath = path.join(".", "hakoniwa", "auth");
    }
    const configPath = path.join(configBasePath, `${configName}.json`);
    return cy.readFile(configPath, "utf-8").then((config) => {
        const { error, value } = CyStoreAuthConfigScheme.validate(config);
        if (error) {
            throw error;
        }
        return value as CyStoreAuthConfig;
    });
})

Cypress.Commands.add('loadAuth', (options: CyStoreAuthOptions) => {
    return cy.loadAuthConfig(options)
        .then((config) => {
            const { cookies: cookiesOptions, authUrl, secretStore, domains } = config;
            const res = {
                toEnd: false,
                loaded: false, 
                authUrl,
            };
            cy.task('readFileOrNull', secretStore)
                .then((secretsContent)=>{
                    if(!isString(secretsContent)) {
                        res.loaded = false;
                        res.toEnd = true;
                    } else {
                        const { error, value: secrets } = CyStoreAuthSecretScheme.validate(Json5.parse(secretsContent));
                        if (error) {
                            throw error;
                        }
                        for (const d of domains) {
                            for (const co of cookiesOptions) {
                                if(!isNil(secrets.cookies[co.key])) {
                                    cy.setCookie(co.key, secrets.cookies[co.key].toString(), Object.assign(co, { domain: d }));
                                }
                            }
                        }
                        options.authCallback && isFunction(options.authCallback) && options.authCallback();
                        res.loaded = true;
                        res.toEnd = true;
                    }
                })
            cy.waitUntil(()=>res.toEnd);
            return cy.wrap(res);
        })
})

Cypress.Commands.add('saveAuth', (options: CyStoreAuthOptions) => {
    cy.loadAuthConfig(options)
        .then(config => {
            const { cookies: cookiesOptions, secretStore } = config;
            const secrets: CyStoreAuthSecret = {
                cookies: {}
            };
            let setCounter = 0;
            for (const co of cookiesOptions) {
                cy.getCookie(co.key)
                    .then(c => {
                        if (c) {
                            secrets.cookies[co.key] = c.value;
                        }
                        setCounter++;
                    });
            }
            cy.waitUntil(()=>setCounter>=cookiesOptions.length);
            cy.writeFile(secretStore, secrets, 'utf8');
        });
})