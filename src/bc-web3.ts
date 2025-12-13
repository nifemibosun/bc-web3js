import { Address, PubKey, PrivKey } from "./utils.js";
import { BlockHeader, BlockInterface } from "./interfaces.js";
import Account from "./account.js";
import Provider from "./provider.js";
import Wallet from "./wallet.js";


export default class BCWeb3 {
    provider: Provider;
    wallet!: Wallet;

    constructor(node_url: string) {
        this.provider = new Provider(node_url);
    }

    createAccount(): { priv_key: PrivKey, pub_key: PubKey, blockchain_addr: Address } {
        return Account.new();
    }

    importAccount(privKey: PrivKey): { priv_key: PrivKey, pub_key: PubKey, blockchain_addr: Address } {
        return Account.new(privKey);
    }

    setWallet(priv_key: PrivKey) {
        this.wallet = new Wallet(priv_key);
    }

    async getBalance(): Promise<number> {
        return await this.provider.check_balance(this.wallet.account.blockchain_addr);
    }

    async getNonce(): Promise<number> {
        return await this.provider.check_nonce(this.wallet.account.blockchain_addr);
    }

    async getLatestBlock(): Promise<BlockInterface>  {
        return await this.provider.get_latest_block();
    }

    async getBlock(block_id: number): Promise<BlockInterface>  {
        return await this.provider.get_block(block_id);
    }

    async getBlocksInRange(start_num: number, end_num: number): Promise<BlockInterface[]> {
        const blocks = await this.provider.get_blocks_in_range(start_num, end_num);
        return [...blocks];
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
    BlockHeader
};