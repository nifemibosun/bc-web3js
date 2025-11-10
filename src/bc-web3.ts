import { Address, PubKey, PrivKey } from "./utils.js";
import { Tx, BlockHeader, BlockInterface } from "./interfaces.js";
import Transaction from "./transaction.js"
import Account from "./account.js";
import Provider from "./provider.js";
import Wallet from "./wallet.js";


export default class BCWeb3 {
    provider: Provider;
    wallet!: Wallet;

    constructor(node_url: string) {
        this.provider = new Provider(node_url);
    }

    async getBalance(address: Address): Promise<number> {
        return await this.provider.check_balance(address);
    }

    async getNonce(address: Address): Promise<number> {
        return await this.provider.check_nonce(address);
    }

    createAccount() {
        this.wallet = new Wallet(new Account());
    }

    importAccount(privKey: PrivKey) {
        this.wallet = new Wallet(new Account(privKey));
    }

    async getTxPool(): Promise<Tx[]> {
        const transactionPool = await this.provider.get_tx_pool();
        return [...transactionPool];
    }

    async getBlock(block_id: number): Promise<BlockInterface>  {
        const block = await this.provider.get_block(block_id);
        return block;
    }

    async getChain(): Promise<BlockInterface[]>  {
        const chain = await this.provider.get_chain();
        return [...chain];
    }

    async transfer(amount: number, recipient: Address): Promise<string> {
        const transferResult = await this.wallet.send_byte(this.provider, amount, recipient);
        return transferResult;
    }
}

export {
    Address,
    PubKey,
    PrivKey,
    Account,
    Transaction,
    BlockHeader,
};