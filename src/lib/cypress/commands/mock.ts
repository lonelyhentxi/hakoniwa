import './env';
import './proxy';
import { 
  PlainProxyRules as Rs,
  PlainProxyRule as R,
  ProxyPattern, ValueOp, ReplaceStatusOp, ResTypeOp,
  ProxyOp, StatusOp
} from '../../whistle/index.browser';

export interface JSONRes {
  name: string;
  body: any;
  statusCode?: number;
  pattern: ProxyPattern;
  opProtocol?: string;
  moreOps?: ProxyOp[],
  waitTime?: number;
  prevent?: boolean;
}

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      mockJSONRes(options: JSONRes): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockJSONRes',(options: JSONRes) => {
  const { HAKONIWA_CYPRESS_WAIT } = Cypress.config('env');
  const prevent = options.prevent!==undefined ? !!options.prevent : true;
  const config = Object.assign({
    statusCode: 200,
    opProtocol: prevent?'resBody':'resMerge',
    moreOps: [],
    waitTime: HAKONIWA_CYPRESS_WAIT,
    prevent: true
  }, options);
  const rules = new Rs(
    config.name,
    new R(config.pattern, [
      prevent ? new StatusOp(config.statusCode): new ReplaceStatusOp(config.statusCode),
      new ResTypeOp('json'),
      new ValueOp(config.opProtocol, config.name),
      ...config.moreOps
    ])
  );
  cy.proxySetValue({
    name: config.name,
    value: JSON.stringify(options.body),
    changed: false,
    force: true
  });
  cy.proxyUseRule(rules);
})