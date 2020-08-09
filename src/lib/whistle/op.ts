export interface IProxyOp {
    op: () => string;
    toString: () => string;
}

export type ProxyOp = string | IProxyOp;

export class RawProxyOp implements IProxyOp {
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

export class PlainProxyOp implements IProxyOp {
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

export class JSONOp implements IProxyOp {
    protocol: string;
    body: object;
    constructor(protocol: string, body: object) {
        this.protocol = protocol;
        this.body = body;
    }
    op() {
        return `${this.protocol}://(${JSON.stringify(this.body).replace(/ /g, '%20').replace(/\r/g,'%0D').replace(/\n/g, '%0A')})`;
    }
    toString() {
        return this.op();
    }
}
export class StatusOp implements IProxyOp {
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

export class ResTypeOp implements IProxyOp {
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