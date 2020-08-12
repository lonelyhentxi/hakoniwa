import './env';
import './proxy';
import { 
  PlainProxyRules as Rs,
  PlainProxyRule as R,
  ProxyPattern, ValueOp, ReplaceStatusOp, ResTypeOp,
  ProxyOp, StatusOp, FileOp
} from '../../whistle/index.browser';

export interface JSONRes {
  name: string;
  body: any;
  statusCode?: number;
  pattern: ProxyPattern;
  opProtocol?: string;
  moreOps?: ProxyOp[],
  prevent?: boolean;
}

export interface BinaryRes {
  name: string;
  path: string;
  type?: string;
  statusCode?: number;
  opProtocol?: string;
  pattern: ProxyPattern;
  moreOps?: ProxyOp[],
  prevent?: boolean;
  autocomplete?: boolean;
}

export interface EmptyRes {
  name: string;
  type?: string;
  statusCode?: number;
  pattern: ProxyPattern;
  moreOps?: ProxyOp[],
  prevent?: boolean; 
}

declare global {
  namespace Cypress {
    export interface Chainable<Subject> {
      mockJSONRes(options: JSONRes): Chainable<void>;
      mockBinaryRes(options: BinaryRes): Chainable<void>;
      mockEmptyRes(options: EmptyRes): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockJSONRes',(options: JSONRes) => {
  const prevent = options.prevent!==undefined ? !!options.prevent : true;
  const config = Object.assign({
    statusCode: 200,
    opProtocol: prevent?'resBody':'resMerge',
    moreOps: [],
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
});

Cypress.Commands.add('mockBinaryRes', (options: BinaryRes) => {
  const prevent = options.prevent!==undefined ? !!options.prevent : true;
  const config = Object.assign({
    statusCode: 200,
    moreOps: [],
    prevent: true,
    opProtocol: 'xfile',
    autocomplete: false
  }, options);
  const ops = [
    prevent ? new StatusOp(config.statusCode): new ReplaceStatusOp(config.statusCode),
    new FileOp(config.path, config.opProtocol, config.autocomplete),
    ...config.moreOps
  ];
  if(config.type) {
    ops.push(new ResTypeOp(config.type));
  }
  const rules = new Rs(
    config.name,
    new R(config.pattern, ops)
  );
  cy.proxyUseRule(rules);
});

Cypress.Commands.add('mockEmptyRes', (options: EmptyRes) => {
  const prevent = options.prevent!==undefined ? !!options.prevent : true;
  const config = Object.assign({
    statusCode: 200,
    moreOps: [],
    prevent: true,
    type: 'text/plain'
  }, options);
  const ops = [
    prevent ? new StatusOp(config.statusCode): new ReplaceStatusOp(config.statusCode),
    ...config.moreOps
  ];
  if(config.type) {
    ops.push(new ResTypeOp(config.type));
  }
  const rules = new Rs(
    config.name,
    new R(config.pattern, ops)
  );
  cy.proxyUseRule(rules);
});