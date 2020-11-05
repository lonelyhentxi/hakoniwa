import {ProxyPattern} from './pattern';
import {ProxyOp} from './op';

export interface IProxyRule {
  rule: () => string;
  toString: () => string;
}

export type ProxyRule = string | IProxyRule;

export class RawProxyRule implements IProxyRule {
  rawRule: string;
  constructor(rule: string) {
    this.rawRule = rule;
  }
  rule() {
    return this.rawRule;
  }
  toString() {
    return this.rule();
  }
}

export class PlainProxyRule implements IProxyRule {
  pattern: ProxyPattern;
  ops: ProxyOp[];
  constructor(pattern: ProxyPattern, ops: ProxyOp[] | ProxyOp) {
    this.pattern = pattern;
    this.ops = ops instanceof Array ? ops : [ops];
  }
  rule() {
    return `${this.pattern.toString()} ${this.ops.map(op => op.toString()).join(' ')}`;
  }
  toString() {
    return this.rule();
  }
}
