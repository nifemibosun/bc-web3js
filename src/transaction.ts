import base58 from "bs58";
import elliptic_pkg from 'elliptic';
import { hash_tobuf, hash_tostr, type PubKey } from "./utils.js";
import { serialize_tx, toJSON } from "./utils.js";
import type { Tx } from "./interfaces.js";


const  { ec: EC } = elliptic_pkg;
const ec = new EC('secp256k1');


class Transaction implements Tx {
    amount: number;
    sender: PubKey;
    recipient: PubKey;
    fee: number;
    tx_id: string;
    signature: string;
    nonce: number;
    timestamp: number;

    constructor(
        amount: number,
        sender: PubKey,
        recipient: PubKey,
        fee: number,
        timestamp: number,
        signature: string,
        nonce: number,
    ) {
        this.amount = amount;
        this.sender = sender;
        this.recipient = recipient;
        this.fee = fee;
        this.tx_id = this.compute_tx_id();
        this.timestamp = timestamp;
        this.nonce = nonce;
        this.signature = signature;
    }

    private get_signing_data(): string {
        return toJSON(serialize_tx(this));
    }

    private compute_tx_id(): string {
        const data = this.get_signing_data();
        const id = hash_tostr(data);
        
        return id;
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

            return this;
        } catch (err) {
            throw new Error('Unable to sign transaction from tx-class');
        }
    }
}


export default Transaction;