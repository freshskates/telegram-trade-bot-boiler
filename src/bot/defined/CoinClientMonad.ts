import { AbstractCoinClient } from "../../clients/AbstractCoinClient";
import {
    ServerError,
    UserWallet
} from "../../utils/types";

export class MonadCoinClient extends AbstractCoinClient {
    constructor() {
        super();
    }

    async createCoinWallet(): Promise<UserWallet & ServerError> {
        return {
            walletPublicKey: "0x1234",
            walletPrivateKey: "0x1234",
            message: "",
            err: false,
        };
    }

    async getCoinWalletBalance(
        publicWalletAdress: string
    ): Promise<{ coinBalance: number } & ServerError> {
        return {
            coinBalance: 1020,
            message: "",
            err: false,
        };
    }

    async getCoinPrice(): Promise<{ coinPrice: number } & ServerError> {
        return {
            coinPrice: 124.1,
            message: "",
            err: false,
        };
    }
}
