import { WhistlePattern } from './whistle.pattern';
import { WhistleOp } from './whistle.op';

export interface IWhistleRule {
    rule: () => string;
    toString: () => string;
}

export type WhistleRule = string | IWhistleRule;

export class RawWhistleRule implements IWhistleRule {
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

export class PlainWhistleRule implements IWhistleRule {
    pattern: WhistlePattern;
    ops: WhistleOp[];
    constructor(pattern: WhistlePattern, ops: WhistleOp[]) {
        this.pattern = pattern;
        this.ops = ops;
    } 
    rule() {
        return `${this.pattern.toString()} ${this.ops.map(op=>op.toString()).join(" ")}`;
    }
}