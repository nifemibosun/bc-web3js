import { Tx_Type } from "./utils.js";


export interface Transaction {
    type: Tx_Type;
    amount: number;
    sender: string;
    recipient: string;
    tx_id: string;
    bytecode?: string; 
    contract_addr?: string;
    signature: string;
    nonce: number;
    timestamp: number;
    publicKey: string;
}

interface BlockHeader {
    nonce: number;
    block_height: number;
    timestamp: number;
    merkleroot: string;
    prev_block_hash: string;
    block_hash: string;
    difficulty: number;
}

interface Block {
    block_header: BlockHeader;
    transactions: Transaction[];
}