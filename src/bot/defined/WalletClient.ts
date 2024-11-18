import { AbstractWalletClient } from "../../clients/AbstractWalletClient";
import { ServerError, UserTokenPosition } from "../../utils/types";

export class WalletClient extends AbstractWalletClient {
    async getOwnedTokens(
        walletPublicKey: string
    ): Promise<UserTokenPosition[]> {


        const tokens = []

        for (let i = 0; i < 30; i++){
            tokens.push({
                name: `Test Token ${i}`,
                address: "0x1234_ABCDEFGHIJKLMNOPQRSTUVWXYZ_ABC",
                ticker:'TEST',
                symbol: "T",
                balance: 100,
                balanceUSD: 1000,
            },
)
        }
        return tokens
    }
}
