export interface ClientResult {
  message?: string;
  err: boolean;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  description: string;
}

export interface TokenMarketDetails extends TokenInfo {
  priceInUsd: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  imageUrl: string;
  website: string;
  twitter: string;
  telegram: string;
}

export interface TokenPosition
  extends Pick<TokenInfo, "name" | "symbol" | "address"> {
  balance: number;
  balanceUsd: number;
}
