import base58 from "bs58";
import elliptic_pkg from 'elliptic';
import { Transaction } from "./interfaces.js";
import { hash_tostr, hash_tobuf } from "./utils.js";

const { ec: EC } = elliptic_pkg;
const ec = new EC('secp256k1');


class Tx implements Transaction {
    amount: number;
    sender: string;
    recipient: string;
    id: string;
    publicKey: string;
    signature: string;
    nonce: number;
    timestamp: number;

    constructor(amount: number, sender: string, recipient: string, publicKey: string, signature: string, nonce: number) {
        this.amount = amount;
        this.sender = sender;
        this.recipient = recipient;
        this.id = "";
        this.publicKey = publicKey;
        this.signature = signature;
        this.nonce = nonce;
        this.timestamp = Date.now();
    }

    create_tx_id() {
        const tx_data_str = `${this.get_signing_data()}${this.signature}`;
        const id = hash_tostr(tx_data_str);

        this.id = id;
    }

    private get_signing_data(): string {
        return `${this.amount}${this.sender}${this.recipient}${this.publicKey}${this.nonce}${this.timestamp}`;
    }

    sign_tx(priv_key: string): Transaction {
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
            this.create_tx_id();
    
            return this;
        } catch (err) {
            throw new Error('Unable to sign transaction');
        }
    }
}


export default Tx;