import { AbstractCoinClient } from "../../clients/AbstractCoinClient";
import { AbstractDatabaseClientHandler } from "../../clients/AbstractDatabaseClientHandler";
import { CoinInformation as CoinInformationMonad } from "../../utils/types";
import { MonadCoinClient as CoinClientMonad } from "./CoinClientMonad";

import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { StorageAdapter } from "grammy";
import { AbstractSwapClient } from "../../clients/AbstractSwapClient";
import { AbstractTokenClient } from "../../clients/AbstractTokenClient";
import { AbstractWalletClient } from "../../clients/AbstractWalletClient";
import { DatabaseClientHandlerPrisma } from "./DatabaseClientHandlerPrisma";
import { SwapClient } from "./SwapClient";
import { TokenClient } from "./TokenClient";
import { WalletClient } from "./WalletClient";

declare global {
    var __globalBotUtility: BotShared | undefined;
}
export class BotShared {
    protected databaseClientHandler: AbstractDatabaseClientHandler;

    protected coinInformtoin: CoinInformationMonad;
    protected coinClient: AbstractCoinClient;

    protected tokenClient: AbstractTokenClient;

    protected walletClient: AbstractWalletClient;
    protected swapClient: AbstractSwapClient;

    constructor(
        databaseClientHandler: AbstractDatabaseClientHandler,
        coinInformtoin: CoinInformationMonad,
        coinClinet: AbstractCoinClient,
        tokenClient: AbstractTokenClient,
        walletClient: AbstractWalletClient,
        swapClient: AbstractSwapClient
    ) {
        this.databaseClientHandler = databaseClientHandler;
        this.coinInformtoin = coinInformtoin;
        this.coinClient = coinClinet;
        this.tokenClient = tokenClient;
        this.walletClient = walletClient;
        this.swapClient = swapClient;
    }

    getCoinInformation(): CoinInformationMonad {
        return this.coinInformtoin;
    }

    getCoinClient(): AbstractCoinClient {
        return this.coinClient;
    }

    getTokenClient(): AbstractTokenClient {
        return this.tokenClient;
    }

    getDatabaseClientHandler(): AbstractDatabaseClientHandler {
        return this.databaseClientHandler;
    }

    getWalletClient(): AbstractWalletClient {
        return this.walletClient;
    }

    getSwapClient(): AbstractSwapClient {
        return this.swapClient;
    }

    /* ------ Special Functions ------ */
    getStorageAdaptorClass(): new <T>(...args: any[]) => StorageAdapter<T> {
        // Alternative Return Type: "new <T>(repository: SessionDelegate) => StorageAdapter<T>"
        return PrismaAdapter;
    }
}

function getBotSharedSingleton(): BotShared {
    if (globalThis.__globalBotUtility == null) {
        const databaseClientHandlerPrisma = new DatabaseClientHandlerPrisma();

        const monadCoinInformation: CoinInformationMonad = {
            name: "Monad",
            ticker: "MON_TEST",
        };

        const coinClientMonad = new CoinClientMonad();

        const tokenClient = new TokenClient();

        const walletClient = new WalletClient();

        const swapClient = new SwapClient();

        globalThis.__globalBotUtility = new BotShared(
            databaseClientHandlerPrisma,
            monadCoinInformation,
            coinClientMonad,
            tokenClient,
            walletClient,
            swapClient
        );
    }

    return globalThis.__globalBotUtility;
}

const getBotShared = getBotSharedSingleton;

export default getBotShared;
