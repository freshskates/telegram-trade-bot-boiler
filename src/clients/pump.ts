import TronWeb from "tronweb";
import {
  approveToken,
  fetchPumpTokenPrice
} from "../lib/helpers";
import { PUMP_LAUNCH_ABI } from "../abi/pump_launch_abi";
import { ERC20_ABI } from "../abi/erc20_abi";
import BigNumber from "bignumber.js";

export class PumpClient {
  private tronWeb: any;
  proxyContractAddress = "TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw";

  async pumpPurchase(
    privateKey: string,
    token: string,
    amountIn: string,
    slippage: number,
  ): Promise<any> {
    const tronWeb = new TronWeb({
      fullHost: "https://api.trongrid.io",
      privateKey: privateKey,
    });
  
    try {
      // Fetch the current token price
      const tokenPrice = await fetchPumpTokenPrice(token);
      console.log(`Current token price: ${tokenPrice}`);
  
      // Convert amountIn to a BigInt for 18 decimal tokens
      const amountInWei = BigInt(amountIn) * BigInt(1e18);
  
      // Convert token price to BigInt by multiplying with 1e18 and flooring
      const tokenPriceWei = BigInt(Math.floor(tokenPrice * 1e18));
  
      // Calculate the expected tokens to receive
      const expectedTokens = amountInWei / tokenPriceWei;
  
      // Calculate the minimum tokens to receive with slippage
      const slippageMultiplier = BigInt(Math.floor((1 - slippage / 100) * 1e18));
      const minTokens = (expectedTokens * slippageMultiplier) / BigInt(1e18);
  
      console.log(`Minimum tokens to receive: ${minTokens.toString()}`);
  
      const contract = await tronWeb.contract(
        PUMP_LAUNCH_ABI,
        this.proxyContractAddress,
      );
  
      let transaction = await contract
        .purchaseToken(
          token,
          minTokens.toString(), // Minimum amount of tokens to receive
        )
        .send({
          callValue: tronWeb.toSun(amountIn),
          feeLimit: 100000000,
          shouldPollResponse: true,
        });
    await approveToken(this.tronWeb, this.proxyContractAddress, token, (expectedTokens * BigInt(10)).toString());
      console.log("Token Purchased:", transaction);
  
      return transaction;
    } catch (error: any) {
      console.error("Error purchasing token:", error);
      return null;
    }
  }

  async pumpSellToken(
    privateKey: string,
    tokenAmount: number | string,
    token: string,
    slippage: number,
  ): Promise<any> {
    const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
        privateKey: privateKey,
      });

    try {
      const amountInWei = new BigNumber(tokenAmount).multipliedBy(new BigNumber(1e18)).toFixed();

  
      // Wait for a short time to ensure the allowance transaction is processed
      await new Promise((resolve) => setTimeout(resolve, 5000));
      
      const contract = await tronWeb.contract(
        PUMP_LAUNCH_ABI,
        this.proxyContractAddress,
      );

      // Fetch the current token price in TRX
      const tokenPrice = await fetchPumpTokenPrice(token);
      console.log(`Current token price: ${tokenPrice}`);

      // Calculate the total expected TRX amount
      const expectedTRX = new BigNumber(tokenPrice).multipliedBy(new BigNumber(tokenAmount)).multipliedBy(new BigNumber(1e6)).toFixed();

      // Apply slippage to calculate the minimum acceptable TRX amount
      const minTRX = new BigNumber(expectedTRX).multipliedBy(new BigNumber(1 - slippage / 100)).toFixed(0);
      console.log(`Minimum TRX to receive: ${minTRX}`);

      // Create the transaction
      let saleTransaction = await contract
        .saleToken(
          token,
          amountInWei, // Amount of tokens to sell
          minTRX, // Minimum TRX to receive
        )
        .send({
          feeLimit: 100000000,
          shouldPollResponse: true,
        });

      console.log("Sell transaction created:", saleTransaction);
  
      return saleTransaction;
    } catch (error: any) {
      console.error("Error selling token:", error.toString());
      return null;
    }
  }
}