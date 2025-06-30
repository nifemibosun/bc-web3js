export interface Transaction {
    amount: number;
    sender: string;
    recipient: string;
    id: string;
    publicKey: string;
    signature: string;
    nonce: number;
    timestamp: number;
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

export interface BlockChain {
    tx_pool: Transaction[];
    chain: Block[];
    difficulty: number;
    addr_bal: Map<string, number>;
    addr_nonce: Map<string, number>;
}