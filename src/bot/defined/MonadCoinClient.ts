import { AbstractCoinClient } from "../../clients/AbstractCoinClient";
import {
    ServerError,
    TokenInformation,
    TokenMarketDetails,
    UserWallet,
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

    async getTokenBalance(
        publicWalletAddress: string,
        tokenContractAddress: string
    ): Promise<{ tokenBalance: number } & ServerError> {
        return {
            tokenBalance: 28,
            message: "",
            err: false,
        };
    }

    // FIXME: WHAT THE FUCK IS THIS FUNCTION SUPPOSED TO DO?
    async withdrawAmount(
        walletPrivateKey: string,
        toAddress: string,
        amount: string
    ): Promise<{ txId: string } & ServerError> { // FIXME: WTF IS txId
        return {
            txId: "0x1234",
            message: "",
            err: false,
        };
    }

    async getTokenInformation(
        tokenAddress: string
    ): Promise<{ token: TokenInformation } & ServerError> {
        return {
            token: {
                name: "Test Token",
                address: "0x1234",
                symbol: "TST",
                decimals: 18,
                description: "This is a test token",
            },
            message: "",
            err: false,
        };
    }

    async getTokenMarketDetails(
        tokenAddress: string
    ): Promise<{ token: TokenMarketDetails } & ServerError> {
        return {
            token: {
                name: "Test Token",
                address: "0x1234",
                symbol: "TST",
                decimals: 9,
                description: "This is a test token",
                priceInUsd: 11,
                marketCap: 1000020,
                volume24h: 324555,
                liquidity: 50000,
                imageUrl: "imageurl",
                website: "https://website.com",
                twitter: "https://x.com/twitter",
                telegram: "https://tg.me/telegram",
            },
            message: "",
            err: false,
        };
    }
}
