import {
  ProxyStartServerOptions,
  ProxyStopServerOptions,
  ProxySetRuleOptions,
  ProxyOptions,
  ProxyIdentifyConfigsOptions,
  ProxyToggleConfigOptions,
  ProxySetValueOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ProxyData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ProxyValue,
} from '../tasks/tasks.defs';
import {
  PlainProxyRules as Rs,
  PlainProxyRule as R,
  ProxyRules,
  RegExpProxyPattern as P,
} from '../../whistle/index.browser';
import './env';

export type PartialProxySetRuleOptions = Partial<ProxySetRuleOptions> & {
  ruleName: string;
  ruleContent: string;
};
export type PartialProxySetValueOptions = Partial<ProxySetValueOptions> & {
  name: string;
  value?: string;
  hide?: boolean;
  active?: boolean;
  changed?: boolean;
  force?: boolean;
};

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      // Proxy Server
      proxyStart(options?: Partial<ProxyStartServerOptions>): Chainable<void>;
      proxyStop(options?: Partial<ProxyStopServerOptions>): Chainable<void>;
      // Proxy Setting
      proxySetDaemonAsDefault(rule?: boolean): Chainable<void>;
      proxySet(options?: Partial<ProxyOptions>): Chainable<void>;
      proxyReset(): Chainable<void>;
      // Proxy Rules
      proxyUseRule(rules: ProxyRules): Chainable<void>;
      proxySetRule(options: PartialProxySetRuleOptions): Chainable<void>;
      proxyToggleMultipleRules(options?: Partial<ProxyToggleConfigOptions>): Chainable<void>;
      proxyRemoveRules(options?: Partial<ProxyIdentifyConfigsOptions>): Chainable<void>;
      // HTTPS & HTTP2
      proxyToggleInterceptHTTPSConnects(options?: Partial<ProxyToggleConfigOptions>): Chainable<void>;
      proxyToggleHTTP2(options?: Partial<ProxyToggleConfigOptions>): Chainable<void>;
      // Proxy Data
      proxyGetData(options?: Partial<ProxyOptions>): Chainable<ProxyData>;
      proxyGetValues(options?: Partial<ProxyOptions>): Chainable<ProxyValue[]>;
      // Proxy Values
      proxySetValue(options: PartialProxySetValueOptions): Chainable<void>;
      proxyRemoveValues(options?: Partial<ProxyIdentifyConfigsOptions>): Chainable<void>;
    }
  }
}

Cypress.Commands.add('proxySetDaemonAsDefault', (value = true) => {
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
});

Cypress.Commands.add('proxyToggleMultipleRules', (options: Partial<ProxyToggleConfigOptions> = {}) => {
  const {HAKONIWA_PROXY_HOST, HAKONIWA_PROXY_PROTOCOL, HAKONIWA_PROXY_PORT} = Cypress.config('env');
  const config = Object.assign(
    {
      host: HAKONIWA_PROXY_HOST,
      protocol: HAKONIWA_PROXY_PROTOCOL,
      port: HAKONIWA_PROXY_PORT,
      value: true,
    },
    options,
  );
  cy.task('proxyToggleMultipleRules', config);
});

Cypress.Commands.add('proxyToggleInterceptHTTPSConnects', (options: Partial<ProxyToggleConfigOptions> = {}) => {
  const {HAKONIWA_PROXY_HOST, HAKONIWA_PROXY_PROTOCOL, HAKONIWA_PROXY_PORT} = Cypress.config('env');
  const config = Object.assign(
    {
      host: HAKONIWA_PROXY_HOST,
      protocol: HAKONIWA_PROXY_PROTOCOL,
      port: HAKONIWA_PROXY_PORT,
      value: true,
    },
    options,
  );
  cy.task('proxyToggleInterceptHTTPSConnects', config);
});

Cypress.Commands.add('proxyToggleHTTP2', (options: Partial<ProxyToggleConfigOptions> = {}) => {
  const {HAKONIWA_PROXY_HOST, HAKONIWA_PROXY_PROTOCOL, HAKONIWA_PROXY_PORT} = Cypress.config('env');
  const config = Object.assign(
    {
      host: HAKONIWA_PROXY_HOST,
      protocol: HAKONIWA_PROXY_PROTOCOL,
      port: HAKONIWA_PROXY_PORT,
      value: true,
    },
    options,
  );
  cy.task('proxyToggleHTTP2', config);
});

Cypress.Commands.add('proxyStart', (options: Partial<ProxyStartServerOptions> = {}) => {
  const {HAKONIWA_PROXY_DIR, HAKONIWA_PROXY_IDENTIFIER, HAKONIWA_PROXY_PORT} = Cypress.config('env');
  const config = Object.assign(
    {
      baseDir: HAKONIWA_PROXY_DIR,
      identifier: HAKONIWA_PROXY_IDENTIFIER,
      port: HAKONIWA_PROXY_PORT,
    },
    options,
  );
  cy.task('proxyStart', config);
});

Cypress.Commands.add('proxyStop', (options: Partial<ProxyStopServerOptions> = {}) => {
  const {HAKONIWA_PROXY_DIR, HAKONIWA_PROXY_IDENTIFIER} = Cypress.config('env');
  const config = Object.assign(
    {
      baseDir: HAKONIWA_PROXY_DIR,
      identifier: HAKONIWA_PROXY_IDENTIFIER,
    },
    options,
  );
  cy.task('proxyStop', config);
});

Cypress.Commands.add('proxySetRule', (options: PartialProxySetRuleOptions) => {
  const {HAKONIWA_PROXY_DIR, HAKONIWA_PROXY_IDENTIFIER} = Cypress.config('env');
  const config = Object.assign(
    {
      baseDir: HAKONIWA_PROXY_DIR,
      identifier: HAKONIWA_PROXY_IDENTIFIER,
    },
    options,
  );
  cy.task('proxySetRule', config);
});

Cypress.Commands.add('proxyUseRule', (rules: ProxyRules) => {
  cy.proxySetRule({ruleName: rules.name, ruleContent: rules.content()});
});

Cypress.Commands.add('proxySet', (options: Partial<ProxyOptions> = {}) => {
  const {
    HAKONIWA_PROXY_HOST,
    HAKONIWA_PROXY_PORT,
    HAKONIWA_PROXY_PROTOCOL,
    HAKONIWA_DAEMON_PROXY_RULE_NAME,
    HAKONIWA_PROXY_DIR,
    HAKONIWA_DAEMON_PROXY_IDENTIFIER,
  } = Cypress.config('env');
  const config = Object.assign(
    {
      host: HAKONIWA_PROXY_HOST,
      port: HAKONIWA_PROXY_PORT,
      protocol: HAKONIWA_PROXY_PROTOCOL,
    },
    options,
  );
  const rules = new Rs(HAKONIWA_DAEMON_PROXY_RULE_NAME, new R(new P(/.*/), `proxy://${config.host}:${config.port}`));
  const proxyArgs = {
    baseDir: HAKONIWA_PROXY_DIR,
    identifier: HAKONIWA_DAEMON_PROXY_IDENTIFIER,
    ruleName: rules.name,
    ruleContent: rules.content(),
  };
  cy.task('proxySetRule', proxyArgs);
});

Cypress.Commands.add('proxyReset', () => {
  const {HAKONIWA_DAEMON_PROXY_RULE_NAME, HAKONIWA_DAEMON_PROXY_IDENTIFIER, HAKONIWA_PROXY_DIR} = Cypress.config('env');
  const rules = new Rs(HAKONIWA_DAEMON_PROXY_RULE_NAME, []);
  cy.task('proxySetRule', {
    baseDir: HAKONIWA_PROXY_DIR,
    identifier: HAKONIWA_DAEMON_PROXY_IDENTIFIER,
    ruleName: rules.name,
    ruleContent: rules.content(),
  });
});

Cypress.Commands.add('proxyGetData', (options: Partial<ProxyOptions> = {}) => {
  const {HAKONIWA_PROXY_PROTOCOL, HAKONIWA_PROXY_PORT, HAKONIWA_PROXY_HOST} = Cypress.config('env');
  const config = Object.assign(
    {
      protocol: HAKONIWA_PROXY_PROTOCOL,
      port: HAKONIWA_PROXY_PORT,
      host: HAKONIWA_PROXY_HOST,
    },
    options,
  );
  return cy.task('proxyGetData', config);
});

Cypress.Commands.add('proxyGetValues', (options: Partial<ProxyOptions> = {}) => {
  const {HAKONIWA_PROXY_PROTOCOL, HAKONIWA_PROXY_PORT, HAKONIWA_PROXY_HOST} = Cypress.config('env');
  const config = Object.assign(
    {
      protocol: HAKONIWA_PROXY_PROTOCOL,
      port: HAKONIWA_PROXY_PORT,
      host: HAKONIWA_PROXY_HOST,
    },
    options,
  );
  return cy.task('proxyGetValues', config);
});

Cypress.Commands.add('proxyRemoveRules', (options: Partial<ProxyIdentifyConfigsOptions> = {}) => {
  const {HAKONIWA_PROXY_PROTOCOL, HAKONIWA_PROXY_PORT, HAKONIWA_PROXY_HOST} = Cypress.config('env');
  const config = Object.assign(
    {
      protocol: HAKONIWA_PROXY_PROTOCOL,
      port: HAKONIWA_PROXY_PORT,
      host: HAKONIWA_PROXY_HOST,
    },
    options,
  );
  if (!options.names) {
    cy.proxyGetData(config).then(data => {
      config.names = data.list;
      cy.task('proxyRemoveRules', config);
    });
  } else {
    cy.task('proxyRemoveRules', config);
  }
});

Cypress.Commands.add('proxyRemoveValues', (options: Partial<ProxyIdentifyConfigsOptions> = {}) => {
  const {HAKONIWA_PROXY_PROTOCOL, HAKONIWA_PROXY_PORT, HAKONIWA_PROXY_HOST} = Cypress.config('env');
  const config = Object.assign(
    {
      protocol: HAKONIWA_PROXY_PROTOCOL,
      port: HAKONIWA_PROXY_PORT,
      host: HAKONIWA_PROXY_HOST,
    },
    options,
  );
  if (!options.names) {
    cy.proxyGetValues(config).then(data => {
      config.names = data.map(v => v.name);
      cy.task('proxyRemoveValues', config);
    });
  } else {
    cy.task('proxyRemoveValues', config);
  }
});

Cypress.Commands.add('proxySetValue', (options: ProxySetValueOptions) => {
  const {HAKONIWA_PROXY_PROTOCOL, HAKONIWA_PROXY_PORT, HAKONIWA_PROXY_HOST} = Cypress.config('env');
  const config = Object.assign(
    {
      protocol: HAKONIWA_PROXY_PROTOCOL,
      port: HAKONIWA_PROXY_PORT,
      host: HAKONIWA_PROXY_HOST,
      force: true,
      active: true,
      hide: false,
      changed: false,
      value: '',
    },
    options,
  );
  cy.proxyGetValues(config).then(data => {
    const valueNames = new Set(data.map(v => v.name));
    if (valueNames.has(config.name) && config.force) {
      cy.proxyRemoveRules({
        ...config,
        names: config.name,
      });
    }
    cy.task('proxySetValue', config);
  });
});
