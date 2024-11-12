import { AbstractSwapClient } from "../../clients/AbstractSwapClient";
import { ServerError } from "../../utils/types";

export class SwapClient extends AbstractSwapClient {
  async swap(
    walletPrivateKey: string,
    fromToken: string,
    toToken: string,
    amountIn: string,
    slippage: number
  ): Promise<
    { transactionId: string; quoteIn: string; quoteOut: string } & ServerError
  > {
    return {
      transactionId: "0x1234",
      quoteIn: "100",
      quoteOut: "200",
      message: "",
      err: false,
    };
  }
}
