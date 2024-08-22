import TronWeb from "tronweb";
import { ROUTER_ABI } from "../abi/router_abi";
import {
  estimateGasFee,
  getSwapRoute,
  getTokenDecimals,
  approveToken,
} from "../lib/helpers";

export class SwapClient {
  private tronWeb: any;
  private smartRouterAddress: string;
  private routerApiUrl: string;

  constructor() {
    this.smartRouterAddress = "TFVisXFaijZfeyeSjCEVkHfex7HGdTxzF9"; // SunSwap smart router CA
    this.routerApiUrl = "https://rot.endjgfsv.link/swap/router"; // SunSwap Router API URL
  }

  async swap(
    privateKey: string,
    fromToken: string,
    toToken: string,
    amountIn: string,
    slippage: number,
  ): Promise<any> {
    try {
      this.tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
        privateKey: privateKey,
      });

      const WTRX = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";

      if (fromToken === "TRX") {
        fromToken = WTRX;
      }
      if (toToken === "TRX") {
        toToken = WTRX;
      }

      console.log(
        "Initialized TronWeb with address:",
        this.tronWeb.defaultAddress.base58,
      );

      const fromTokenDecimals = await getTokenDecimals(this.tronWeb, fromToken);
      const toTokenDecimals = await getTokenDecimals(this.tronWeb, toToken);

      let amountInSun: string;

      if (fromTokenDecimals > 6) {
        amountInSun = (
          BigInt(
            Math.floor(parseFloat(amountIn) * 10 ** (fromTokenDecimals - 6)),
          ) * BigInt(10 ** 6)
        ).toString();
      } else {
        amountInSun = BigInt(
          Math.floor(parseFloat(amountIn) * 10 ** fromTokenDecimals),
        ).toString();
      }

      const routeInfo = await getSwapRoute(
        this.routerApiUrl,
        fromToken,
        toToken,
        amountInSun,
      );
      console.log("Route Info:", routeInfo);

      const paths = routeInfo.tokens;
      const fees = routeInfo.poolFees;

      const poolVersions = [];
      const versionLen = [];

      let currentVersion = routeInfo.poolVersions[0];
      let currentLength = 1;

      for (let i = 1; i < routeInfo.tokens.length; i++) {
        const previousToken = routeInfo.tokens[i - 1];
        const currentToken = routeInfo.tokens[i];

        if (routeInfo.poolVersions[i - 1] === currentVersion) {
          currentLength++;
        } else {
          poolVersions.push(currentVersion);
          versionLen.push(currentLength);

          currentVersion = routeInfo.poolVersions[i - 1];
          currentLength = 1;
        }
      }

      poolVersions.push(currentVersion);
      versionLen.push(currentLength);

      console.log("Final Pool Versions:", poolVersions);
      console.log("Final Version Lengths:", versionLen);

      let amountOutSun: string;
      if (toTokenDecimals > 6) {
        amountOutSun = (
          BigInt(
            Math.floor(
              parseFloat(routeInfo.amountOut) * 10 ** (toTokenDecimals - 6),
            ),
          ) * BigInt(10 ** 6)
        ).toString();
      } else {
        amountOutSun = BigInt(
          Math.floor(parseFloat(routeInfo.amountOut) * 10 ** toTokenDecimals),
        ).toString();
      }

      const amountOutMinimum = Math.floor(
        parseFloat(routeInfo.amountOut) * (1 - slippage / 100),
      );
      const amountOutMinimumSun = (
        BigInt(amountOutMinimum) * BigInt(10 ** toTokenDecimals)
      ).toString();

      const deadline = (Math.floor(Date.now() / 1000) + 60 * 10).toString();

      const data = [
        amountInSun,
        amountOutMinimumSun,
        this.tronWeb.defaultAddress.base58,
        deadline,
      ];

      const transactionParams = {
        paths,
        poolVersions,
        versionLen,
        fees,
        data,
      };
      console.log(transactionParams);

      if (fromToken !== WTRX) {
        await approveToken(
          this.tronWeb,
          this.smartRouterAddress,
          fromToken,
          amountInSun,
        );
      }
      // estimated fee currently not working, unsure why.
      // const estimatedFee = await estimateGasFee(this.tronWeb, this.smartRouterAddress, transactionParams);
      // console.log(estimatedFee)
      console.log("Paths:", paths);
      console.log("Pool Versions:", poolVersions);
      console.log("Version Lengths:", versionLen);
      console.log("Fees:", fees);
      console.log("Swap Data:", data);

      const router = await this.tronWeb.contract(
        ROUTER_ABI,
        this.smartRouterAddress,
      );

      console.log(
        "Successfully initialized Smart Router contract at:",
        this.smartRouterAddress,
      );

      const transaction = await router.methods
        .swapExactInput(paths, poolVersions, versionLen, fees, data)
        .send({
          callValue: fromToken === WTRX ? amountInSun : 0,
          feeLimit: 100 * 1e6,
          shouldPollResponse: true,
        });

      console.log("Transaction:", transaction);
      return transaction;
    } catch (error) {
      console.error("Error performing swap:", error);
      throw error;
    }
  }
}
