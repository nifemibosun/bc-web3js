import * as crypto from 'crypto';
import { Buffer } from 'buffer';
import elliptic_pkg from 'elliptic';
import base58 from 'bs58';
import Transaction from './transaction.js';
import { Address, PubKey, PrivKey } from './utils.js';

const { ec: EC } = elliptic_pkg;
const ec = new EC('secp256k1');


class Account {
    private priv_key: Buffer;
    public  pub_key: PubKey;
    public  blockchain_addr: PrivKey;

    constructor(priv_key?: PrivKey) {
        this.priv_key = Buffer.from(Account.new(priv_key).priv_key, 'hex');
        this.pub_key = Account.create_pub_key(this.priv_key.toString('hex'));
        this.blockchain_addr = Account.create_blockchain_addr(this.pub_key);
    }

    static is_valid_priv_key(priv_key: PrivKey): boolean {
        return typeof priv_key === 'string' && /^[0-9a-fA-F]{64}$/.test(priv_key);
    }

    static new(privKey?: PrivKey): { priv_key: PrivKey, pub_key: PubKey, blockchain_addr: Address } {
        let priv_key = "";

        if (privKey) {
            if (!Account.is_valid_priv_key(privKey)) {
                throw new Error("Invalid private key: must be a 64-character hex string");
            }
            priv_key = privKey;
        }
        else {
            priv_key = ec.genKeyPair().getPrivate('hex');
        }

        const pub_key = Account.create_pub_key(priv_key);
        const blockchain_addr = Account.create_blockchain_addr(pub_key);
        return { priv_key, pub_key, blockchain_addr };
    }

    // Generates the public key from a private key
    static create_pub_key(priv_key: PrivKey): PubKey {
        const key_pair = ec.keyFromPrivate(priv_key);
        const pub_key = key_pair.getPublic(true, 'hex');
        return pub_key;
    }

    // Creates a blockchain address from the public key
    static create_blockchain_addr(pub_key: PubKey): Address {
        const pub_key_buffer = Buffer.from(pub_key, 'hex');
        const sha256_hash = crypto.createHash('sha256').update(pub_key_buffer).digest();
        const ripemd160_hash = crypto.createHash('ripemd160').update(sha256_hash).digest();
        const version_byte = Buffer.from([0xBC]); // Version byte 
        const payload = Buffer.concat([version_byte, ripemd160_hash]);
        const checksum = crypto.createHash('sha256').update(
            crypto.createHash('sha256').update(payload).digest()
        ).digest().slice(0, 4);
        const final_payload = Buffer.concat([payload, checksum]);
        const blockchain_addr = base58.encode(final_payload);
        
        return blockchain_addr;
    }

    sign_tx(tx: Transaction): Transaction {
        return tx.sign_tx(this.priv_key.toString('hex'));
    }
}


export default Account;
