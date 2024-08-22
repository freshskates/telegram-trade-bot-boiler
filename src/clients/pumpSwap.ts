import TronWeb from "tronweb";
import {
  approveToken,
  fetchPumpTokenPrice
} from "../lib/helpers";
import { PUMP_LAUNCH_ABI } from "../abi/pump_launch_abi";
import { ERC20_ABI } from "../abi/erc20_abi";

export class PumpSwapClient {
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

      // Calculate the minimum purchase amount based on slippage
      const expectedTokens = amountInWei / BigInt(Math.floor(tokenPrice * 1e18));
      const minTokens = expectedTokens * BigInt(1 - slippage / 100);
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
          callValue: amountInWei.toString(),
          feeLimit: 100000000,
        });

      console.log("Token Purchased:", transaction);

      return transaction;
    } catch (error: any) {
      console.error("Error purchasing token:", error.toString());
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
          
      await approveToken(
        tronWeb,
        this.proxyContractAddress,
        token,
        (Number(tokenAmount) * 1e18).toString(),
      );

      console.log("Allowance set for token:", token);
  
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
      const expectedTRX = BigInt(Math.floor(tokenPrice * 1e18)) * BigInt(Number(tokenAmount) * 1e18) / BigInt(1e18);

      // Apply slippage to calculate the minimum acceptable TRX amount
      const minTRX = expectedTRX * BigInt(1 - slippage / 100);
      console.log(`Minimum TRX to receive: ${minTRX.toString()}`);

      // Create the transaction
      let saleTransaction = await contract
        .saleToken(
          token,
          (Number(tokenAmount) * 1e18).toString(), // Amount of tokens to sell
          minTRX.toString(), // Minimum TRX to receive
        )
        .send({
          feeLimit: 100000000,
        });

      console.log("Sell transaction created:", saleTransaction);
  
      return saleTransaction;
    } catch (error: any) {
      console.error("Error selling token:", error.toString());
      return null;
    }
  }
}
