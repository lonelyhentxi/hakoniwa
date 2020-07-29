import * as Json5 from 'json5';

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

export class PlainWhistleOp implements IWhistleOp {
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

export class JSONOp implements IWhistleOp {
    protocol: string;
    body: object;
    constructor(protocol: string, body: object) {
        this.protocol = protocol;
        this.body = body;
    }
    op() {
        return `${this.protocol}://(${JSON.stringify(this.body).replace(/ /g, '%20')})`;
    }
    toString() {
        return this.op();
    }
}
export class StatusOp implements IWhistleOp {
    protocol  = 'replaceStatus';
    statusCode: number;
    constructor(statusCode: number) {
        this.statusCode = statusCode;
    }
    op() {
        return `${this.protocol}://${this.statusCode}`;
    }
    toString() {
        return this.op();
    }
}

export class ResTypeOp implements IWhistleOp {
    protocol  = 'resType';
    type: string;
    constructor(type: string) {
        this.type = type;
    }
    op() {
        return `${this.protocol}://${this.type}`;
    }
    toString() {
        return this.op();
    }
}