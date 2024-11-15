import { ServerError, TokenInformation, TokenMarketDetails, UserWallet } from "../utils/types";

export abstract class AbstractTokenClient {
    constructor() {}

    abstract getTokenBalance(
        publicWalletAddress: string,
        tokenContractAddress: string
    ): Promise<{ tokenBalance: number } & ServerError>;

    abstract withdrawAmount(
        walletPrivateKey: string,
        toAddress: string,
        amount: string
    ): Promise<{ txId: string } & ServerError>;

    abstract getTokenInformation(
        tokenAddress: string
    ): Promise<{ token: TokenInformation } & ServerError>;

    abstract getTokenMarketDetails(
        tokenAddress: string
    ): Promise<{ token: TokenMarketDetails } & ServerError>;
    
}
