import { Address, PubKey } from "./utils.ts";

export interface Tx {
    amount: number;
    sender: Address;
    recipient: Address;
    fee: number;
    tx_id: string;
    signature: string;
    nonce: number;
    timestamp: number;
    publicKey: PubKey;
}

export interface BlockHeader {
    nonce: number;
    block_height: number;
    timestamp: number;
    merkleroot: string;
    prev_block_hash: string;
    block_hash: string;
    difficulty: number;
}

export interface BlockInterface {
    block_header: BlockHeader;
    transactions: Tx[];
}