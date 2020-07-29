import { WhistleRule } from './whistle.rule';

export interface IWhistleRules {
    name: string;
    content: () => string;
}

export type WhistleRules = IWhistleRules;

export class RawWhistleRules implements IWhistleRules {
    name: string;
    rawContent: string;
    constructor(name: string, content: string) {
        this.name = name;
        this.rawContent = content;
    }
    content() {
        return this.rawContent;
    }
}


export class PlainWhistleRules implements IWhistleRules {
    name: string;
    rules: WhistleRule[]
    constructor(name: string, rules: WhistleRule[] | WhistleRule) {
        this.name = name;
        this.rules = rules instanceof Array ? rules : [rules];
    }
    content() {
        return `
        exports.name = \`${this.name}\`;
        exports.rules = \`${this.rules.map(r => r.toString()).join("\n")}\`;
        `;
    }
}

export class ExtendedWhistleRules implements IWhistleRules {
    name: string;
    plugins: string[];
    rules: WhistleRule[];
    constructor(name: string, rules: WhistleRule[] | WhistleRule, plugins: string[] | string) {
        this.name = name;
        this.rules = rules instanceof Array ? rules : [rules];
        this.plugins = plugins instanceof Array ? plugins : [plugins];
    }
    content() {
        return `
        const assert = require('assert');
        module.exports = (cb, util) => {
            assert(${this.plugins.map(p => `util.existsPlugin(${p})`).join("&&")}, \`please install plugins: ${this.plugins.join(",")}\`);
            cb({
                name: \`${name}\`,
                rules: \`${this.rules.map(r => r.toString()).join("\n")}\`
            });
        };
        `
    }
}