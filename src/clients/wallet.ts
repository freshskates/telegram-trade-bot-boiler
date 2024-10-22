import { ClientResult, TokenPosition } from "../utils";

export class WalletClient {
  static async getOwnedTokens(
    walletPb: string
  ): Promise<{ tokens: TokenPosition[] } & ClientResult> {
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
