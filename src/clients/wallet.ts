import { ServerError, UserTokenPosition } from "../utils/types";

export class WalletClient {
    static async getOwnedTokens(
        walletPublicKey: string
    ): Promise<{ tokens: UserTokenPosition[] } & ServerError> {
        return {
            tokens: [
                {
                    name: "akjsdl",
                    address: "0x1234",
                    symbol: "WIF",
                    balance: 100,
                    balanceUsd: 1000,
                },
            ],
            message: "",
            err: false,
        };
    }
}
