import { ServerError, SwapTransaction } from "../utils/types";

export abstract class AbstractSwapClient {
    abstract swap(
        walletPrivateKey: string,
        fromToken: string,
        toToken: string,
        amountIn: string,
        slippage: number
    ): Promise<
        SwapTransaction
    >;
}
