import { PartialMergeWhistleRuleOptions, PartialStartWhistleServerOptions, PartialStopWhistleServerOptions } from '../../cypress/tasks/tasks.defs';
import { 
  HAKONIWA_PROXY_PORT, HAKONIWA_PROXY_PROTOCOL,
  HAKONIWA_PROXY_DIR, HAKONIWA_DAEMON_PROXY_IDENTIFIER, 
  HAKONIWA_DAEMON_PROXY_RULE_NAME
} from '../../../constants/constants.browser';
import { PlainWhistleRules as Rs, PlainWhistleRule as R } from '../../whistle/index.browser';

export interface SetProxyOptions {
  host: string;
  port: string;
  protocol: 'http' | 'https'
}

export type  PartialSetProxyOptions = Partial<SetProxyOptions>;

export {
  PartialStartWhistleServerOptions,
  PartialStopWhistleServerOptions,
  PartialMergeWhistleRuleOptions
}



declare global {
  namespace Cypress {
      export interface Chainable<Subject> {
        startProxy(options?: PartialStartWhistleServerOptions): Chainable<void>;
        stopProxy(options?: PartialStopWhistleServerOptions): Chainable<void>;
        mergeRule(options: PartialMergeWhistleRuleOptions): Chainable<void>;
        setProxy(options?: PartialSetProxyOptions): Chainable<void>;
        resetProxy(options?: PartialSetProxyOptions): Chainable<void>;
      }
  }
}

Cypress.Commands.add('startProxy', (options: PartialStartWhistleServerOptions = {}) => {
  cy.task('startProxy', options);
})

Cypress.Commands.add('stopProxy', (options: PartialStopWhistleServerOptions = {}) => {
  cy.task('stopProxy', options);
})

Cypress.Commands.add('mergeRule', (options: PartialMergeWhistleRuleOptions) => {
  cy.task('mergeRule', options);
})

Cypress.Commands.add('setProxy', (options: PartialSetProxyOptions = {}) => {
  const config = Object.assign({
    host: 'localhost',
    port: HAKONIWA_PROXY_PORT,
    protocol: HAKONIWA_PROXY_PROTOCOL
  }, options);
  const rules =  new Rs(
    HAKONIWA_DAEMON_PROXY_RULE_NAME,
      new R(/.*/, `proxy://${config.host}:${config.port}`)
    );
  cy.task('mergeRule', {
    baseDir: HAKONIWA_PROXY_DIR,
    identifier: HAKONIWA_DAEMON_PROXY_IDENTIFIER,
    ruleName: rules.name,
    ruleContent: rules.content(),
  });
})

Cypress.Commands.add('resetProxy', () => {
  const rules =  new Rs(
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