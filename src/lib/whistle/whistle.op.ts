export interface IWhistleOp {
    op: () => string;
    toString: () => string;
}

export type WhistleOp = string | IWhistleOp;

export class RawWhistleOp implements IWhistleOp {
    rawOp: string;
    constructor(op: string) {
        this.rawOp = op;
    }
    op() {
        return this.rawOp;
    }
    toString() {
        return this.op();
    }
}

export class PlainWhistleRule implements IWhistleOp {
    protocol: string;
    body: string;
    constructor(protocol: string, body: string) {
        this.protocol = protocol;
        this.body = body;
    }
    op() {
        return `${this.protocol}://${this.body}`;
    }
    toString() {
        return this.op();
    }
}