import { Block, Transaction } from "./interfaces.js";
import Account from "./account.js";
import Provider from "./provider.js";
import Wallet from "./wallet.js";


class BCWeb3 {
    provider: Provider;
    wallet!: Wallet;

    constructor(node_url: string) {
        this.provider = new Provider(node_url);
    }

    async get_bal(address: string): Promise<number> {
        return await this.provider.check_balance(address);
    }

    async get_nonce(address: string): Promise<number> {
        return await this.provider.check_nonce(address);
    }

    createAccount() {
        this.wallet = new Wallet(new Account(), this.provider);
    }

    loadAccount(privKey: string) {
        this.wallet = new Wallet(new Account(privKey), this.provider);
    }

    async get_tx_pool(): Promise<Transaction[]> {
        const transactionPool = await this.provider.get_tx_pool();
        return [...transactionPool];
    }

    async get_block(block_id: number): Promise<Block>  {
        const block = await this.provider.get_block(block_id);
        return block;
    }

    async get_chain(): Promise<Block[]>  {
        const chain = await this.provider.get_chain();
        return [...chain];
    }

    async transfer(amount: number, recipient: string): Promise<string> {
        const transferResult = await this.wallet.send_byte(amount, recipient);
        return transferResult;
    }

    async deployContract(bytecode: string): Promise<string> {
        const deployResult = await this.wallet.deploy_contract(bytecode);
        return deployResult;
    }

    async callContract(contractAddr: string): Promise<string> {
        const callResult = await this.wallet.call_contract(contractAddr);
        return callResult;
    }
}

export default BCWeb3;