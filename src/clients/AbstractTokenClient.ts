import { ServerError, TokenInformation, TokenMarketDetails, UserWallet } from "../utils/types";

export abstract class AbstractTokenClient {
    constructor() {}

    abstract getTokenBalance(
        publicWalletAddress: string,
        tokenContractAddress: string
    ): Promise<{ tokenBalance: number }>;

    abstract withdrawAmount(
        walletPrivateKey: string,
        toAddress: string,
        amount: string
    ): Promise<{ txId: string }>;

    abstract getTokenInformation(
        tokenAddress: string
    ): Promise<TokenInformation>;

    abstract getTokenMarketDetails(
        tokenAddress: string
    ): Promise<TokenMarketDetails>;
    
}
