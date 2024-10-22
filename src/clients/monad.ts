import { ClientResult, TokenInfo, TokenMarketDetails } from "../utils";

export class MonadClient {
  constructor() {}

  static async createWallet(): Promise<
    { publicKey: string; privateKey: string } & ClientResult
  > {
    return {
      publicKey: "0x1234",
      privateKey: "0x1234",
      message: "",
      err: false,
    };
  }

  static async checkMonadBalance(
    address: string
  ): Promise<{ monadBalance: number } & ClientResult> {
    return {
      monadBalance: 1020,
      message: "",
      err: false,
    };
  }

  static async getMonadPrice(): Promise<{ monadPrice: number } & ClientResult> {
    return {
      monadPrice: 124.1,
      message: "",
      err: false,
    };
  }

  static async checkTokenBalance(
    address: string,
    tokenContractAddress: string
  ): Promise<{ tokenBalance: number } & ClientResult> {
    return {
      tokenBalance: 28,
      message: "",
      err: false,
    };
  }

  static async withdraw(
    privateKey: string,
    toAddress: string,
    amount: string
  ): Promise<{ txId: string } & ClientResult> {
    return {
      txId: "0x1234",
      message: "",
      err: false,
    };
  }

  static async fetchTokenBasicDetails(
    tokenAddress: string
  ): Promise<{ token: TokenInfo } & ClientResult> {
    return {
      token: {
        name: "Test Token",
        address: "0x1234",
        symbol: "TST",
        decimals: 18,
        description: "This is a test token",
      },
      message: "",
      err: false,
    };
  }

  static async fetchTokenMarketDetails(
    tokenAddress: string
  ): Promise<{ token: TokenMarketDetails } & ClientResult> {
    return {
      token: {
        name: "Test Token",
        address: "0x1234",
        symbol: "TST",
        decimals: 9,
        description: "This is a test token",
        priceInUsd: 11,
        marketCap: 1000020,
        volume24h: 324555,
        liquidity: 50000,
        imageUrl: "imageurl",
        website: "https://website.com",
        twitter: "https://x.com/twitter",
        telegram: "https://tg.me/telegram",
      },
      message: "",
      err: false,
    };
  }
}
