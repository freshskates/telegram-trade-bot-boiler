export interface ServerError {
    message?: string;
    err: boolean;
}

export interface TokenInformation {
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    description: string;
}

export interface TokenMarketDetails extends TokenInformation {
    priceInUsd: number;
    marketCap: number;
    volume24h: number;
    liquidity: number;
    imageUrl: string;
    website: string;
    twitter: string;
    telegram: string;
}

export interface CoinInformation {
    name: string;
    ticker: string;
}


export interface UserWallet {
    walletPublicKey: string;
    walletPrivateKey: string;
}

export interface User {
    id: string;
    username: string;
    walletPrivateKey: string;
    walletPublicKey: string;
    referredBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSettings {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserTokenPosition
    extends Pick<TokenInformation, "name" | "symbol" | "address"> {
    balance: number;
    balanceUSD: number;
}

export interface SwapTransaction {
    transactionId: string;
    quoteIn: string;
    quoteOut: string;
}
