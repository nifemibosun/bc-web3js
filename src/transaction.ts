import base58 from "bs58";
import elliptic_pkg from 'elliptic';
import { Tx_Type } from "./utils.js";
import { hash_tobuf, hash_tostr } from "./utils.js";
import { Transaction } from "./interfaces.js";


const  { ec: EC } = elliptic_pkg;
const ec = new EC('secp256k1');


class Tx implements Transaction {
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

    constructor(
        amount: number,
        sender: string,
        recipient: string,
        type: Tx_Type,
        timestamp: number,
        publicKey: string,
        signature: string,
        nonce: number,
        bytecode?: string,
    ) {
        this.amount = amount;
        this.sender = sender;
        this.recipient = recipient;
        this.type = type;
        this.timestamp = timestamp;
        this.publicKey = publicKey;
        this.signature = signature;
        this.nonce = nonce;
        this.tx_id = "";

        if (this.type === Tx_Type.CONTRACT || bytecode !== undefined) {
            this.bytecode = bytecode;
        }
    }

    private get_signing_data(): string {
        if (this.type === Tx_Type.BYTE_TX) {
            return `${this.type}${this.amount}${this.sender}${this.recipient}${this.publicKey}${this.nonce}${this.timestamp}`;
        } else if ((this.bytecode !== undefined || this.contract_addr !== undefined) || this.type === Tx_Type.CONTRACT) {
            return `${this.type}${this.amount}${this.sender}${this.recipient}${this.publicKey}${this.nonce}${this.timestamp}${this.bytecode}${this.contract_addr}`;
        }
        
        throw new Error('Unknown transaction type');
    }

    private compute_tx_id(): string {
        const data = this.get_signing_data();
        const id = hash_tostr(data);
        
        return id;
    }

    get_tx_nonce(): number {
        return this.nonce;
    }

    compute_contract_addr() {
        const c_addr = hash_tostr(this.get_signing_data());
        this.contract_addr = c_addr;
    }

    sign_tx(priv_key: string): Tx {
        try {
            const data_str = this.get_signing_data();
            
            const hashed_tx = hash_tobuf(data_str);
            const key_pair = ec.keyFromPrivate(priv_key, 'hex');
            const sig = key_pair.sign(hashed_tx, 'hex');
            const r = sig.r.toArrayLike(Buffer, 'be', 32);
            const s = sig.s.toArrayLike(Buffer, 'be', 32);
            const compact_sig = Buffer.concat([r, s]);
            const sign = base58.encode(compact_sig);

            this.signature = sign;
            this.tx_id = this.compute_tx_id();

            return this;
        } catch (err) {
            throw new Error('Unable to sign transaction from tx-class');
        }
    }
}


export default Tx;