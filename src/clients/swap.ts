import { ClientResult } from "../utils";

export class SwapClient {
  constructor() {}

  static async swap(
    privateKey: string,
    fromToken: string,
    toToken: string,
    amountIn: string,
    slippage: number
  ): Promise<
    { txId: string; quoteIn: string; quoteOut: string } & ClientResult
  > {
    return {
      txId: "0x1234",
      quoteIn: "100",
      quoteOut: "200",
      message: "",
      err: false,
    };
  }
}
