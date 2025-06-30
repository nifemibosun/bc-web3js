import { BlockChain, Transaction } from "./interfaces.js";
import Account from "./account.js";

// Minimal for now will continue adding more functionalities later
class BCWeb3 {
    private bc_instance: BlockChain;

    constructor(instance: BlockChain) {
        this.bc_instance = instance;
    }

    get_acc_bal(address: string): number {
        return this.bc_instance.addr_bal.get(address) ?? 0;
    }

    create_new_tx(amount: number, recipient: string, priv_key?: string): Transaction {
        const account = new Account(this.bc_instance, priv_key);
        const tx = account.acc_sign_tx(amount, recipient);

        return tx;
    }
}

export default BCWeb3;