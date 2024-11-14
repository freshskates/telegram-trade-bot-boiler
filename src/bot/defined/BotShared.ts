import { AbstractCoinClient } from "../../clients/AbstractCoinClient";
import { AbstractDatabaseClientHandler } from "../../clients/AbstractDatabaseClientHandler";
import { CoinInformation } from "../../utils/types";
import { MonadCoinClient } from "./MonadCoinClient";

import { PrismaAdapter } from "@grammyjs/storage-prisma";
import { StorageAdapter } from "grammy";
import { AbstractWalletClient } from "../../clients/AbstractWalletClient";
import { PrismaClientDatabaseHandler } from "./PrismaDatabaseClientHandler";
import { WalletClient } from "./WalletClient";
import { AbstractSwapClient } from "../../clients/AbstractSwapClient";
import { SwapClient } from "./SwapClient";

declare global {
    var __globalBotUtility: BotShared | undefined;
}
export class BotShared {
    protected coinInformtoin: CoinInformation;
    protected coinClient: AbstractCoinClient;
    protected databaseClientHandler: AbstractDatabaseClientHandler;
    protected walletClient: AbstractWalletClient;
    protected swapClient: AbstractSwapClient;

    constructor(
        databaseClientHandler: AbstractDatabaseClientHandler,
        coinInformtoin: CoinInformation,
        coinClinet: AbstractCoinClient,
        walletClient: AbstractWalletClient,
        swapClient: AbstractSwapClient,
    ) {
        this.databaseClientHandler = databaseClientHandler;
        this.coinInformtoin = coinInformtoin;
        this.coinClient = coinClinet;
        this.walletClient = walletClient
        this.swapClient = swapClient
    }

    getCoinInformation(): CoinInformation {
        return this.coinInformtoin;
    }

    getCoinClient(): AbstractCoinClient {
        return this.coinClient;
    }

    getDatabaseClientHandler(): AbstractDatabaseClientHandler {
        return this.databaseClientHandler;
    }

    getWalletClient(): AbstractWalletClient {
        return this.walletClient
    }

    getSwapClient(): AbstractSwapClient{
        return this.swapClient
    }

    /* ------ Special Functions ------ */
    getStorageAdaptorClass(): new <T>(...args: any[]) => StorageAdapter<T> {
        // Alternative Return Type: "new <T>(repository: SessionDelegate) => StorageAdapter<T>"
        return PrismaAdapter;
    }
}

function getBotSharedSingleton(): BotShared {
    if (globalThis.__globalBotUtility == null) {
        const prismaDatabaseClientHandler = new PrismaClientDatabaseHandler();

        const monadInformation: CoinInformation = {
            name: "Monad",
            ticker: "MON_TEST",
        };

        const monadCoinClient = new MonadCoinClient();

        const walletClient = new WalletClient()
        
        const swapClient = new SwapClient()

        globalThis.__globalBotUtility = new BotShared(
            prismaDatabaseClientHandler,
            monadInformation,
            monadCoinClient,
            walletClient,
            swapClient,
        );
    }

    return globalThis.__globalBotUtility;
}


const getBotShared = getBotSharedSingleton;

export default getBotShared;
