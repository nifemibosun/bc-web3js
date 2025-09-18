import Account from "./account.js";
import Provider from "./provider.js";
import { Tx_Type, GEN_CONTRACT_RECIPIENT } from "./utils.js";
import Tx from "./transaction.js";


class Wallet {
    constructor(
        public account: Account,
        private provider: Provider,
    ) {}

    async send_byte(amount: number, recipient: string): Promise<string> {
        try {
            const { pub_key, blockchain_addr } = this.account;
            const nonce = await this.provider.check_nonce(blockchain_addr);
            const tx = new Tx(amount, blockchain_addr, recipient, Tx_Type.BYTE_TX, Date.now(), pub_key, "", nonce + 1);
            const signed_tx = this.account.sign_tx(tx);
        
            return this.provider.send_tx(signed_tx);
        } catch (err) {
            throw new Error('Unable to sign transaction from account class');
        }
    }

    async deploy_contract(bytecode: string): Promise<string> {
        try {
            const { pub_key, blockchain_addr } = this.account;
            const nonce = await this.provider.check_nonce(blockchain_addr);
            const tx = new Tx(0, blockchain_addr, GEN_CONTRACT_RECIPIENT, Tx_Type.CONTRACT, Date.now(), pub_key, "", nonce + 1, bytecode);
            tx.compute_contract_addr();
            const signed_tx = this.account.sign_tx(tx);
        
            return this.provider.send_tx(signed_tx);
        } catch (err) {
            throw new Error(`Unable to sign contract transaction: ${err}`);
        }
    }

    async call_contract(contract_addr: string,): Promise<string> {
        try {
            const { pub_key, blockchain_addr } = this.account;
            const nonce = await this.provider.check_nonce(blockchain_addr);
            const tx = new Tx(0, blockchain_addr, contract_addr, Tx_Type.CONTRACT_CALL, Date.now(), pub_key, "", nonce + 1);
            const signed_tx = this.account.sign_tx(tx);
        
            return this.provider.send_tx(signed_tx);
        } catch (err) {
            throw new Error(`Unable to sign contract call transaction: ${err}`);
        }
    }
}


export default Wallet;