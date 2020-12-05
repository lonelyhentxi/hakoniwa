import {ProxyRule} from './rule';

export interface IProxyRules {
  name: string;
  content: () => string;
}

export type ProxyRules = IProxyRules;

export class PlainProxyRules implements IProxyRules {
  name: string;
  rules: ProxyRule[];

  constructor(name: string, rules: ProxyRule[] | ProxyRule) {
    this.name = name;
    this.rules = rules instanceof Array ? rules : [rules];
  }

  content() {
    return this.rules.map(r => r.toString()).join('\n');
  }

  text() {
    return `
        exports.name = \`${this.name}\`;
        exports.rules = \`${this.rules.map(r => r.toString()).join('\n')}\`;
        `;
  }
}

export class ExtendedProxyRules implements IProxyRules {
  name: string;
  plugins: string[];
  rules: ProxyRule[];

  constructor(name: string, rules: ProxyRule[] | ProxyRule, plugins: string[] | string) {
    this.name = name;
    this.rules = rules instanceof Array ? rules : [rules];
    this.plugins = plugins instanceof Array ? plugins : [plugins];
  }

  content() {
    return this.rules.map(r => r.toString()).join('\n');
  }

  text() {
    return `
        const assert = require('assert');
        module.exports = (cb, util) => {
            assert(${this.plugins
      .map(p => `util.existsPlugin(${p})`)
      .join('&&')}, \`please install plugins: ${this.plugins.join(',')}\`);
            cb({
                name: \`${name}\`,
                rules: \`${this.rules.map(r => r.toString()).join('\n')}\`
            });
        };
        `;
  }
}
