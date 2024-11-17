import {
    ServerError,
    TokenInformation,
    TokenMarketDetails,
    UserWallet,
} from "../utils/types";

export abstract class AbstractCoinClient {
    constructor() {}

    abstract createCoinWallet(): Promise<UserWallet>;

    abstract getCoinWalletBalance(
        publicWalletAddress: string
    ): Promise<{ coinBalance: number }>;

    abstract getCoinPrice(): Promise<{ coinPrice: number }>;

    // abstract getTokenBalance(
    //     publicWalletAddress: string,
    //     tokenContractAddress: string
    // ): Promise<{ tokenBalance: number }>;

    // abstract withdrawAmount(
    //     walletPrivateKey: string,
    //     toAddress: string,
    //     amount: string
    // ): Promise<{ txId: string }>;

    // abstract getTokenInformation(
    //     tokenAddress: string
    // ): Promise<{ token: TokenInformation }>;

    // abstract getTokenMarketDetails(
    //     tokenAddress: string
    // ): Promise<{ token: TokenMarketDetails }>;

    // abstract getTokenDexScreenerURL(): Promise<
    //     { token: TokenMarketDetails }
    // >;
}
