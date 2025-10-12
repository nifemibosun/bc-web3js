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

    async getBalance(address: string): Promise<number> {
        return await this.provider.check_balance(address);
    }

    async getNonce(address: string): Promise<number> {
        return await this.provider.check_nonce(address);
    }

    createAccount() {
        this.wallet = new Wallet(new Account());
    }

    importAccount(privKey: string) {
        this.wallet = new Wallet(new Account(privKey));
    }

    async getTxPool(): Promise<Transaction[]> {
        const transactionPool = await this.provider.get_tx_pool();
        return [...transactionPool];
    }

    async getBlock(block_id: number): Promise<Block>  {
        const block = await this.provider.get_block(block_id);
        return block;
    }

    async getChain(): Promise<Block[]>  {
        const chain = await this.provider.get_chain();
        return [...chain];
    }

    async transfer(amount: number, recipient: string): Promise<string> {
        const transferResult = await this.wallet.send_byte(this.provider, amount, recipient);
        return transferResult;
    }
}

export default BCWeb3;