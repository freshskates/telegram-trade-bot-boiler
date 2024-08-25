import TronWeb from "tronweb";
import {
  approveToken,
  calculateDeadline,
  calculateMinimumOutput,
  fetchPumpTokenPrice,
  getSwapRoute,
  getTokenDecimals, // Assuming this is available in your helpers
} from "../lib/helpers";
import { ROUTER_ABI } from "../abi/router_abi";
import { PUMP_LAUNCH_ABI } from "../abi/pump_launch_abi";
import { PumpClient } from "./pump";
import { PUMP_ROUTER_ABI } from "../abi/pump_router";
import { ERC20_ABI } from "../abi/erc20_abi";

export class SwapClient {
  private tronWeb: any;
  private smartRouterAddress: string;
  private pumpRouterAddress: string;
  private pumpClient: PumpClient;
  private feeWalletAddress: string;

  constructor() {
    this.smartRouterAddress = "TFVisXFaijZfeyeSjCEVkHfex7HGdTxzF9"; // SunSwap smart router CA
    this.pumpRouterAddress = "TZFs5ch1R1C4mmjwrrmZqeqbUgGpxY1yWB"; // Pump Swap Router CA
    this.pumpClient = new PumpClient();
    this.feeWalletAddress = "TKFm9V2ScWeF4fgKvPRxejVQoy46c5Zs6p";
  }

  async swap(
    privateKey: string,
    fromToken: string,
    toToken: string,
    amountIn: string,
    slippage: number,
  ): Promise<any> {
    try {
      const routerApiUrl = "https://rot.endjgfsv.link/swap/router";
      this.tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
        privateKey: privateKey,
      });

      const WTRX = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";
      const isTRXFromToken = fromToken === "TRX";
      const isTRXToToken = toToken === "TRX";

      if (isTRXFromToken) fromToken = WTRX;
      if (isTRXToToken) toToken = WTRX;

      // Fetch Pump Token Price depending on TRX involvement
      let tokenPrice = null;
      try {
        if (isTRXToToken) {
          tokenPrice = await fetchPumpTokenPrice(fromToken);
        } else if (isTRXFromToken) {
          tokenPrice = await fetchPumpTokenPrice(toToken);
        }
      } catch (error) {
        console.warn("Pump token price fetch failed:", error);
      }

      // Handle amountIn based on token decimals
      let amountInSun: string;
      if (!isTRXFromToken) {
        const fromTokenDecimals = await getTokenDecimals(this.tronWeb, fromToken);
        amountInSun = (BigInt(Math.floor(parseFloat(amountIn) * (10 ** fromTokenDecimals)))).toString();
      } else {
        amountInSun = (BigInt(amountIn) * BigInt(10 ** 6)).toString(); // Assuming TRX has 6 decimals
      }

      // Fetch swap route
      const routeInfo = await getSwapRoute(
        routerApiUrl,
        fromToken,
        toToken,
        amountInSun
      );

      if (tokenPrice && !routeInfo) {
        // Use PumpClient for pump purchase or sale
        if (isTRXFromToken) {
          return await this.pumpClient.pumpPurchase(
            privateKey,
            toToken,
            amountIn,
            slippage
          );
        } else {
          return await this.pumpClient.pumpSellToken(
            privateKey,
            amountIn,
            fromToken,
            slippage
          );
        }
      }

      // Determine the appropriate router and ABI
      let routerAddress = this.smartRouterAddress;
      let routerABI = ROUTER_ABI;

      if (tokenPrice && routeInfo) {
        console.log("Setting route info for Pump Router");
        routerAddress = this.pumpRouterAddress;
        routerABI = PUMP_ROUTER_ABI;
      } else if (routeInfo) {
        console.log("Setting route info for Smart Router");
        routerAddress = this.smartRouterAddress;
        routerABI = ROUTER_ABI;
      } else {
        console.error("Failed to determine route or token price.");
        throw new Error("Unable to perform swap.");
      }

      // Prepare the swap parameters
      const paths = routeInfo.tokens;
      const fees = routeInfo.poolFees;
      let tokenOutDecimals = 6
      if (toToken != WTRX) {
        const decimals = await getTokenDecimals(this.tronWeb, toToken) 
        tokenOutDecimals = decimals
      }
      console.log(tokenOutDecimals)
      const amountOutMinimum = calculateMinimumOutput(
        routeInfo.amountOut,
        slippage,
        tokenOutDecimals
      );
      const data = [
        amountInSun,
        amountOutMinimum,
        this.tronWeb.defaultAddress.base58,
        calculateDeadline(),
      ];

      // Approve tokens if necessary
      if (!isTRXFromToken) {
        await approveToken(this.tronWeb, routerAddress, fromToken, amountInSun);
      }

      // Initialize and execute the swap
      const routerContract = await this.tronWeb.contract(
        routerABI,
        routerAddress
      );
      let transaction = [];

      if (!tokenPrice && routeInfo) {
        transaction = await routerContract.methods
          .swapExactInput(
            paths,
            routeInfo.poolVersions,
            routeInfo.versionLen,
            fees,
            data
          )
          .send({
            callValue: isTRXFromToken ? amountInSun : 0,
            feeLimit: 100 * 1e6,
            shouldPollResponse: true,
          });
      } else if (tokenPrice && routeInfo) {
        if (isTRXFromToken) {
          const adjustedPaths = [paths[1], paths[paths.length - 1]];
          console.log(adjustedPaths)
          transaction = await routerContract.methods
            .swapExactETHForTokens(
              amountOutMinimum,
              adjustedPaths,
              this.tronWeb.defaultAddress.base58,
              calculateDeadline()
            )
            .send({
              callValue: Number(amountIn) * 1e6,
              feeLimit: 100 * 1e6,
              shouldPollResponse: true,
            });
        } else if (isTRXToToken) {
          const adjustedPaths = [paths[0], paths[paths.length - 2]];
          console.log(amountOutMinimum, amountInSun)
          transaction = await routerContract.methods
            .swapExactTokensForETH(
              amountInSun,
              amountOutMinimum,
              adjustedPaths,
              this.tronWeb.defaultAddress.base58,
              calculateDeadline()
            )
            .send({
              callValue: 0,
              feeLimit: 100 * 1e6,
              shouldPollResponse: true,
            });
        }
      }

      await this.handleFeeTransaction(isTRXFromToken, isTRXToToken, amountInSun, routeInfo);
      console.log("Transaction successful:", transaction);
      return transaction;
    } catch (error) {
      console.error("Error performing swap:", error);
      throw error;
    }
  }

  private async handleFeeTransaction(
    isTRXFromToken: boolean,
    isTRXToToken: boolean,
    amountInSun: string,
    routeInfo: any
  ) {
    try {
      let feeAmountSun = BigInt(0);

      if (isTRXFromToken) {
        // Calculate 1% of the TRX amount in SUN (1 SUN = 10^-6 TRX)
        feeAmountSun = BigInt(amountInSun) / BigInt(100);
      } else if (isTRXToToken) {
        // Calculate 1% of the output TRX amount
        feeAmountSun = BigInt(Math.floor(routeInfo.amountOut * 1e6)) / BigInt(100);
      }
      console.log("Is TRX from token:", isTRXFromToken);
      console.log("Is TRX to token:", isTRXToToken);
      console.log("Calculated fee in SUN:", feeAmountSun.toString());

      if (feeAmountSun > 0) {
        const transaction = await this.tronWeb.trx.sendTransaction(
          this.feeWalletAddress,
          feeAmountSun.toString()
        );
        console.log("Fee transferred to fee wallet:", transaction);
      }
    } catch (error) {
      console.error("Error transferring fee to fee wallet:", error);
      throw error;
    }
  }

}
