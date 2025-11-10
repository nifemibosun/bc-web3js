import { BlockInterface, Tx } from "./interfaces.js";
import { Address } from "./utils.js";


class Provider {
    constructor(private rpc_url: string) {}

    async check_nonce(addr: Address): Promise<number> {
        const res = await fetch(`${this.rpc_url}/nonce/${addr}`);
        const n_nonce = (await res.json()).nonce;
        return n_nonce;
    }

    async check_balance(addr: Address): Promise<number> {
        const res = await fetch(`${this.rpc_url}/balance/${addr}`);
        const acc_bal = (await res.json()).balance;
        return acc_bal;
    }

    async check_fee(): Promise<number> {
        const res = await fetch(`${this.rpc_url}/fee`);
        const curr_fee = (await res.json()).fee;
        return curr_fee;
    }

    async get_tx_pool(): Promise<Tx[]> {
        const res = await fetch(`${this.rpc_url}/tx/pool`);
        const tx_pool = await res.json();
        return tx_pool;
    }

    async get_block(block_num: number): Promise<BlockInterface> {
        const res = await fetch(`${this.rpc_url}/chain/${block_num}`);
        const block = await res.json();
        return block;
    }

    async get_chain(): Promise<BlockInterface[]> {
        const res = await fetch(`${this.rpc_url}/chain`);
        const chain = await res.json();
        return chain;
    }

    async send_tx(tx: Tx): Promise<string> {
        const res = await fetch(
            `${this.rpc_url}/tx/send`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tx)
            }
        );
        const tx_hash = (await res.json()).tx_id;
        return tx_hash;
    }
}


export default Provider;