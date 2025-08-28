import * as crypto from 'crypto';

// Take a buffer as input an return a buffer as output
function hash_func(data_buf: Buffer): Buffer {
    const hashed_data = crypto.createHash('sha256').update(data_buf).digest();

    return hashed_data;
}

// Take a str as input an return a buffer as output
export function hash_tobuf(data_str: string): Buffer {
    if (typeof data_str !== 'string') {
        throw new TypeError('Data must be a string.');
    }

    const hex_buffer: Buffer = Buffer.from(data_str, 'utf8');
    const hashed_transaction = hash_func(hex_buffer);
    
    return hashed_transaction;
}

// Take a str as input an return a str as output
export function hash_tostr(data_str: string): string {
    if (typeof data_str !== 'string') {
        throw new TypeError('Data must be a string.');
    }
    const hashed_data = crypto.createHash('sha256').update(data_str).digest('hex');

    return hashed_data;
}

export const GEN_CONTRACT_RECIPIENT: string = "0x000000000000000000000000000000000000000BC";

export enum Tx_Type {
    BYTE_TX = 'byte_tx',
    CONTRACT = 'contract',
    CONTRACT_CALL = 'contract_call'
}

export const print = (...data: any): void => {
    console.dir(...data, { depth: null, colors: true });
}
