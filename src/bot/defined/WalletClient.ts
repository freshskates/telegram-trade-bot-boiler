import { AbstractWalletClient } from "../../clients/AbstractWalletClient";
import { ServerError, UserTokenPosition } from "../../utils/types";

export class WalletClient extends AbstractWalletClient {
    async getOwnedTokens(
        walletPublicKey: string
    ): Promise<{ tokens: UserTokenPosition[] } & ServerError> {


        const tokens = []

        for (let i = 0; i < 30; i++){
            tokens.push({
                name: `Test Token ${i}`,
                address: "0x1234",
                symbol: "TES",
                balance: 100,
                balanceUSD: 1000,
            },
)
        }
        return {
            tokens: tokens,
            message: "",
            err: false,
        };
    }
}
