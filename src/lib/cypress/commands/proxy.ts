import {
  StartWhistleServerOptions, StopWhistleServerOptions, MergeWhistleRuleOptions,
  ProxyOptions, AllowWhistleMultipleRulesOptions, RemoveWhistleRulesOptions
} from '../tasks/tasks.defs';
import { PlainWhistleRules as Rs, PlainWhistleRule as R, WhistleRules, RegExpWhistlePattern as P } from '../../whistle/index.browser';
import './env';

export type PartialStartWhistleServerOptions = Partial<StartWhistleServerOptions>;
export type PartialStopWhistleServerOptions = Partial<StopWhistleServerOptions>;
export type PartialMergeWhistleRuleOptions = Partial<MergeWhistleRuleOptions> & {
  ruleName: string;
  ruleContent: string;
};
export type PartialProxyOptions = Partial<ProxyOptions>;
export type PartialAllowWhistleMultipleRulesOptions = Partial<AllowWhistleMultipleRulesOptions>;

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      setDaemonAsDefaultProxy(rule?: boolean): Chainable<void>;
      startProxy(options?: PartialStartWhistleServerOptions): Chainable<void>;
      stopProxy(options?: PartialStopWhistleServerOptions): Chainable<void>;
      useRule(rules: WhistleRules): Chainable<void>;
      mergeRule(options: PartialMergeWhistleRuleOptions): Chainable<void>;
      setProxy(options?: PartialProxyOptions): Chainable<void>;
      resetProxy(): Chainable<void>;
      allowMultipleRules(options?: PartialAllowWhistleMultipleRulesOptions): Chainable<void>;
      getProxyData(options?: Partial<ProxyOptions>): Chainable<any>;
      removeRules(options?: Partial<RemoveWhistleRulesOptions>): Chainable<void>;
    }
  }
}

Cypress.Commands.add('setDaemonAsDefaultProxy', (value = true) => {
  const env = Cypress.config('env');
  if (value) {
    const newEnv = Object.assign(env, {
      HAKONIWA_PROXY_IDENTIFIER: env['HAKONIWA_DAEMON_PROXY_IDENTIFIER'],
      HAKONIWA_PROXY_PORT: env['HAKONIWA_DAEMON_PROXY_PORT'],
      HAKONIWA_PROXY_LAST_IDENTIFIER: env['HAKONIWA_PROXY_IDENTIFIER'],
      HAKONIWA_PROXY_LAST_PORT: env['HAKONIWA_PROXY_PORT'],
    });
    Cypress.config('env', newEnv);
  } else {
    const newEnv = Object.assign(env, {
      HAKONIWA_PROXY_IDENTIFIER: env['HAKONIWA_PROXY_LAST_IDENTIFIER'] || env['HAKONIWA_PROXY_IDENTIFIER'],
      HAKONIWA_PROXY_PORT: env['HAKONIWA_PROXY_LAST_PORT'] || env['HAKONIWA_PROXY_PORT'],
    });
    Cypress.config('env', newEnv);
  }
})

Cypress.Commands.add('allowMultipleRules', (options: PartialAllowWhistleMultipleRulesOptions = {}) => {
  const {
    HAKONIWA_PROXY_HOST,
    HAKONIWA_PROXY_PROTOCOL,
    HAKONIWA_PROXY_PORT,
  } = Cypress.config('env');
  const config = Object.assign({
    host: HAKONIWA_PROXY_HOST,
    protocol: HAKONIWA_PROXY_PROTOCOL,
    port: HAKONIWA_PROXY_PORT,
    value: true
  }, options);
  cy.task('allowMultipleRules', config);
});

Cypress.Commands.add('startProxy', (options: PartialStartWhistleServerOptions = {}) => {
  const {
    HAKONIWA_PROXY_DIR,
    HAKONIWA_PROXY_IDENTIFIER,
    HAKONIWA_PROXY_PORT
  } = Cypress.config('env');
  const config = Object.assign({
    baseDir: HAKONIWA_PROXY_DIR,
    identifier: HAKONIWA_PROXY_IDENTIFIER,
    port: HAKONIWA_PROXY_PORT
  }, options);
  cy.task('startProxy', config);
})

Cypress.Commands.add('stopProxy', (options: PartialStopWhistleServerOptions = {}) => {
  const {
    HAKONIWA_PROXY_DIR,
    HAKONIWA_PROXY_IDENTIFIER,
  } = Cypress.config('env');
  const config = Object.assign({
    baseDir: HAKONIWA_PROXY_DIR,
    identifier: HAKONIWA_PROXY_IDENTIFIER
  }, options);
  cy.task('stopProxy', config);
})

Cypress.Commands.add('mergeRule', (options: PartialMergeWhistleRuleOptions) => {
  const {
    HAKONIWA_PROXY_DIR,
    HAKONIWA_PROXY_IDENTIFIER,
  } = Cypress.config('env');
  const config = Object.assign({
    baseDir: HAKONIWA_PROXY_DIR,
    identifier: HAKONIWA_PROXY_IDENTIFIER
  }, options);
  cy.task('mergeRule', config);
})

Cypress.Commands.add('useRule', (rules: WhistleRules) => {
  cy.mergeRule({ ruleName: rules.name, ruleContent: rules.content() });
})

Cypress.Commands.add('setProxy', (options: PartialProxyOptions = {}) => {
  const {
    HAKONIWA_PROXY_HOST,
    HAKONIWA_PROXY_PORT,
    HAKONIWA_PROXY_PROTOCOL,
    HAKONIWA_DAEMON_PROXY_RULE_NAME,
    HAKONIWA_PROXY_DIR,
    HAKONIWA_DAEMON_PROXY_IDENTIFIER,
  } = Cypress.config('env');
  const config = Object.assign({
    host: HAKONIWA_PROXY_HOST,
    port: HAKONIWA_PROXY_PORT,
    protocol: HAKONIWA_PROXY_PROTOCOL
  }, options);
  const rules = new Rs(
    HAKONIWA_DAEMON_PROXY_RULE_NAME,
    new R(new P(/.*/), `proxy://${config.host}:${config.port}`)
  );
  const proxyArgs = {
    baseDir: HAKONIWA_PROXY_DIR,
    identifier: HAKONIWA_DAEMON_PROXY_IDENTIFIER,
    ruleName: rules.name,
    ruleContent: rules.content(),
  };
  cy.task('mergeRule', proxyArgs);
})

Cypress.Commands.add('resetProxy', () => {
  const {
    HAKONIWA_DAEMON_PROXY_RULE_NAME,
    HAKONIWA_DAEMON_PROXY_IDENTIFIER,
    HAKONIWA_PROXY_DIR,
  } = Cypress.config('env');
  const rules = new Rs(
    HAKONIWA_DAEMON_PROXY_RULE_NAME,
    []
  );
  cy.task('mergeRule', {
    baseDir: HAKONIWA_PROXY_DIR,
    identifier: HAKONIWA_DAEMON_PROXY_IDENTIFIER,
    ruleName: rules.name,
    ruleContent: rules.content(),
  });
})


Cypress.Commands.add('getProxyData', (options: Partial<ProxyOptions> = {}) => {
  const {
    HAKONIWA_PROXY_PROTOCOL,
    HAKONIWA_PROXY_PORT,
    HAKONIWA_PROXY_HOST,
  } = Cypress.config('env');
  const config = Object.assign({
    protocol: HAKONIWA_PROXY_PROTOCOL,
    port: HAKONIWA_PROXY_PORT,
    host: HAKONIWA_PROXY_HOST,
  }, options);
  return cy.task('getProxyData', options);
})

Cypress.Commands.add('removeRules', (options: Partial<RemoveWhistleRulesOptions> = {}) => {
  const {
    HAKONIWA_PROXY_PROTOCOL,
    HAKONIWA_PROXY_PORT,
    HAKONIWA_PROXY_HOST,
  } = Cypress.config('env');
  const config = Object.assign({
    protocol: HAKONIWA_PROXY_PROTOCOL,
    port: HAKONIWA_PROXY_PORT,
    host: HAKONIWA_PROXY_HOST,
  }, options);
  if (!options.rules) {
    cy.getProxyData(config).then((data) => {
      config.rules = data.list;
      cy.task('removeRules', config);
    })
  } else {
    cy.task('removeRules', config);
  }
})