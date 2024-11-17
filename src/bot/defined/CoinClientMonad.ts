import { AbstractCoinClient } from "../../clients/AbstractCoinClient";
import {
    ServerError,
    UserWallet
} from "../../utils/types";

export class MonadCoinClient extends AbstractCoinClient {
    constructor() {
        super();
    }

    async createCoinWallet(): Promise<UserWallet> {
        return {
            walletPublicKey: "0x1234",
            walletPrivateKey: "0x1234",
            // message: "",
            // err: false,
        };
    }

    async getCoinWalletBalance(
        publicWalletAddress: string
    ): Promise<{ coinBalance: number }> {
        return {
            coinBalance: 1020,
            // message: "",
            // err: false,
        };
    }

    async getCoinPrice(): Promise<{ coinPrice: number }> {
        return {
            coinPrice: 124.1,
            // message: "",
            // err: false,
        };
    }
}
