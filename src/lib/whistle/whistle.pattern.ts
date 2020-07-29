export interface IWhistlePattern {
    pattern: () => string;
    toString: () => string;
}

export type WhistlePattern = string | IWhistlePattern;

export class RawWhistlePattern implements IWhistlePattern {
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

export class RegExpWhistlePattern implements IWhistlePattern {
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