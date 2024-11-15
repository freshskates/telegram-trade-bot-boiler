import { AbstractTokenClient } from "../../clients/AbstractTokenClient";
import {
    ServerError,
    TokenInformation,
    TokenMarketDetails,
} from "../../utils/types";

export class TokenClient extends AbstractTokenClient {
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
    ): Promise<{ txId: string } & ServerError> {
        // FIXME: WTF IS txId
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
                URL_image: "imageurl",
                URL_website: "https://website.com",
                URL_twitter: "https://x.com/twitter",
                URL_telegram: "https://tg.me/telegram",
                URL_dexscreener: "https://dexscreener.com/tron/tz4ur8mfkfykuftmsxcda7rs3r49yy2gl6",
                
            },
            message: "",
            err: false,
        };
    }
}
