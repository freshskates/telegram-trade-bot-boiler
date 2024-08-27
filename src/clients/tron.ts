import TronWeb from "tronweb";
import { ERC20_ABI } from "../abi/erc20_abi";
import axios from "axios";
import { extractTokenData } from "../utils/helpers";

export class TronClient {
  private tronWeb: any;

  constructor() {
    this.tronWeb = new TronWeb({
      fullHost: "https://api.trongrid.io",
    });
  }

  /**
   * Creates a new Tron wallet.
   * @returns {Promise<any>} A promise that resolves to the new wallet's details.
   */
  static async createWallet(): Promise<any> {
    try {
      const tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
      });

      const account = await tronWeb.createAccount();
      return account;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  }

  /**
   * Checks the balance of a Tron wallet.
   * @param address The address of the wallet to check.
   * @returns {Promise<string>} The balance in TRX.
   */
  async checkBalance(address: string): Promise<string> {
    try {
      const balance = await this.tronWeb.trx.getBalance(address);
      return this.tronWeb.fromSun(balance); // Convert from SUN to TRX
    } catch (error) {
      console.error("Error checking balance:", error);
      throw error;
    }
  }

  /**
   * Gets the current TRX price in USD.
   * @returns {Promise<number>} The current TRX price in USD.
   */
  async getTRXPrice(): Promise<number> {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd"
      );
      const data = await response.json();
      return data.tron.usd;
    } catch (error) {
      console.error("Error fetching TRX price:", error);
      throw error;
    }
  }

  /**
   * Checks the balance of a specific token in a Tron wallet.
   * @param privateKey The private key of the wallet.
   * @param address The address of the wallet to check.
   * @param tokenContractAddress The contract address of the token.
   * @returns {Promise<string>} The balance of the token in the wallet.
   */
  async checkTokenBalance(
    privateKey: string,
    address: string,
    tokenContractAddress: string
  ): Promise<string> {
    try {
      const tronWebWithKey = new TronWeb({
        fullHost: "https://api.trongrid.io",
        privateKey: privateKey, // Initialize with provided private key
      });
      const contract = await tronWebWithKey.contract(
        ERC20_ABI,
        tokenContractAddress
      );
      console.log(address);
      const balance = await contract.balanceOf(address).call();
      const decimals = await contract.decimals().call();
      return (balance / Math.pow(10, decimals)).toString(); // Adjust for token decimals
    } catch (error) {
      console.error("Error checking token balance:", error);
      throw error;
    }
  }

  /**
   * Withdraws TRX from the current wallet to another address.
   * @param privateKey The private key to sign the transaction.
   * @param toAddress The address to send TRX to.
   * @param amount The amount of TRX to send.
   * @returns {Promise<any>} The transaction result.
   */
  async withdraw(
    privateKey: string,
    toAddress: string,
    amount: string
  ): Promise<any> {
    try {
      const tronWebWithKey = new TronWeb({
        fullHost: "https://api.trongrid.io",
        privateKey: privateKey, // Initialize with provided private key
      });

      const amountInSun = tronWebWithKey.toSun(amount); // Convert amount to SUN (smallest unit)
      const transaction = await tronWebWithKey.trx.sendTransaction(
        toAddress,
        amountInSun
      );
      return transaction;
    } catch (error) {
      console.error("Error withdrawing TRX:", error);
      throw error;
    }
  }

  async getTransactionInfo(txId: string) {
    try {
      const transactionInfo = await this.tronWeb.trx.getTransactionInfo(txId);
      let hexMessage = transactionInfo.resMessage;
      let decodedMessage = Buffer.from(hexMessage, "hex").toString("utf8");
      console.log("Transaction Info:", decodedMessage);
    } catch (error) {
      console.error("Error fetching transaction info:", error);
    }
  }

  static async getTokensOwned(walletAddress: string) {
    const apiKey = "8a20c4ef-24cc-4f15-b11f-2fc3045635e3";

    console.log(walletAddress);

    const endpoint = `https://apilist.tronscanapi.com/api/account/tokens?address=${walletAddress}&start=0&limit=20&hidden=0&show=0&sortType=0&sortBy=0&token=`;

    try {
      const response = await axios.get(endpoint, {
        headers: {
          "TRON-PRO-API-KEY": apiKey,
        },
      });

      const data = response.data.data;

      return extractTokenData(data);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      throw error;
    }
  }
}
