export interface IWhistlePattern {
    pattern: () => string;
    toString: () => string;
}

export type WhistlePattern = string | RegExp | IWhistlePattern;

export class RawWhistlePattern implements IWhistlePattern {
    rawPattern: string | RegExp;
    constructor(pattern: string | RegExp) {
        this.rawPattern = pattern;
    }
    pattern() {
        return this.rawPattern.toString();
    }
    toString() {
        return this.pattern();
    }
}