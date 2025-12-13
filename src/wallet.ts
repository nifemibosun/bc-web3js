import Account from "./account.js";
import Provider from "./provider.js";
import Transaction from "./transaction.js";
import type { Address, PrivKey } from "./utils.js";

class Wallet {
    public account;
    
    constructor(priv_key: PrivKey,) {
        this.account = new Account(priv_key)
    }

    async send_byte(provider: Provider, amount: number, recipient: Address): Promise<string> {
        try {
            const { pub_key, blockchain_addr } = this.account;
            const nonce = await provider.check_nonce(blockchain_addr);
            const fee = await provider.check_fee();
            const tx = new Transaction(amount, blockchain_addr, recipient, fee, Date.now(), pub_key, "", nonce + 1);
            const signed_tx = this.account.sign_tx(tx);
        
            return provider.send_tx(signed_tx);
        } catch (err) {
            throw new Error('Unable to sign transaction from account class');
        }
    }
}


export default Wallet;