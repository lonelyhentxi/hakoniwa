export interface IProxyPattern {
  pattern: () => string;
  toString: () => string;
}

export type ProxyPattern = string | IProxyPattern;

export class RawProxyPattern implements IProxyPattern {
  rawPattern: string;
  constructor(pattern: string) {
    this.rawPattern = pattern;
  }
  pattern() {
    return this.rawPattern.toString();
  }
  toString() {
    return this.pattern();
  }
}

export class RegExpProxyPattern implements IProxyPattern {
  rawPattern: RegExp;
  constructor(pattern: RegExp) {
    this.rawPattern = pattern;
  }
  pattern() {
    return `/${this.rawPattern.source}/`;
  }
  toString() {
    return this.pattern();
  }
}
