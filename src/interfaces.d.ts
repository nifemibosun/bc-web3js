export interface Transaction {
    amount: number;
    sender: string;
    recipient: string;
    fee: number;
    tx_id: string;
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