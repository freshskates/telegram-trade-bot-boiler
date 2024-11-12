import { ServerError, UserTokenPosition } from "../utils/types";


export abstract class AbstractWalletClient{
    abstract getOwnedTokens(walletPublicKey:string): Promise<{ tokens: UserTokenPosition[] } & ServerError>
    
}