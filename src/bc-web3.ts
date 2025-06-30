import base58 from "bs58";
import crypto from "crypto";
import { Block, BlockChain, Transaction } from "./interfaces.js";
import Account from "./account.js";


class BCWeb3 {
    private bc_instance: BlockChain;
    private accounts: Map<string, Account> = new Map();

    constructor(instance: BlockChain) {
        this.bc_instance = instance;
    }

    static is_valid_address(address: string): boolean {
        try {
            const decodedUint8 = base58.decode(address);
            const decoded = Buffer.from(decodedUint8); 

            if (decoded.length < 5) return false;
            const payload = decoded.slice(0, decoded.length - 4);
            const checksum = decoded.slice(decoded.length - 4);

            const calculated_checksum = crypto.createHash('sha256')
                                            .update(crypto.createHash('sha256')
                                            .update(payload)
                                            .digest())
                                            .digest()
                                            .slice(0, 4);

            return checksum.equals(calculated_checksum);
        } catch (e) {
            console.error("Error validating address:", e);
            return false;
        }
    }

    get_acc_bal(address: string): number {
        return this.bc_instance.addr_bal.get(address) ?? 0;
    }

    load_account(priv_key?: string): Account {
        const account = new Account(this.bc_instance, priv_key);
        this.accounts.set(account.blockchain_addr, account);
        return account;
    }

    public get_account(address: string): Account | undefined {
        return this.accounts.get(address);
    }

    create_new_tx(account: Account, amount: number, recipient: string): Transaction {
        if (!this.accounts.has(account.blockchain_addr)) {
            throw new Error("Account not loaded in this BCWeb3 instance.");
        }

        const tx = account.acc_sign_tx(amount, recipient);
        return tx;
    }

    get_block(block_id: number | string): Block | undefined {
        if (typeof block_id === 'number') {
            if (block_id < 0 || block_id >= this.bc_instance.chain.length) {
                return undefined;
            }

            return this.bc_instance.chain[block_id];
        } else {
            return this.bc_instance.chain.find(block => block.block_header.block_hash === block_id);
        }
    }

    get_latest_block(): Block | undefined {
        if (this.bc_instance.chain.length === 0) return undefined;
        return this.bc_instance.chain[this.bc_instance.chain.length - 1];
    }

    get_transaction(tx_id: string): Transaction | undefined {
        for (const block of this.bc_instance.chain) {
            const tx = block.transactions.find(t => t.id === tx_id);
            if (tx) return tx;
        }
        return this.bc_instance.tx_pool.find(t => t.id === tx_id);
    }

    get_transaction_pool(): Transaction[] {
        return [...this.bc_instance.tx_pool];
    }
}

export default BCWeb3;