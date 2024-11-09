import { AbstractCoinClient } from "../../clients/AbstractCoinClient";
import { AbstractDatabaseClientHandler } from "../../clients/AbstractDatabaseClientHandler";
import { CoinInformation } from "../../utils/types";
import { MonadCoinClient } from "./MonadCoinClient";

import { Settings, User } from "@prisma/client";
import { PrismaClientDatabaseHandler } from "./PrismaDatabaseClientHandler";

declare global {
    var __globalBotUtility: BotShared<any, any> | undefined;
}

export class BotShared<GenericDatabaseUser, GenericDatabaseSettings> {
    _coinInformtoin: CoinInformation;
    _coinClient: AbstractCoinClient;
    _databaseClientHandler: AbstractDatabaseClientHandler;

    constructor(
        databaseClientHandler: AbstractDatabaseClientHandler,
        coinInformtoin: CoinInformation,
        coinClinet: AbstractCoinClient
    ) {
        this._databaseClientHandler = databaseClientHandler;
        this._coinInformtoin = coinInformtoin;
        this._coinClient = coinClinet;
    }

    getCoinInformation(): CoinInformation {
        return this._coinInformtoin;
    }

    getCoinClient(): AbstractCoinClient {
        return this._coinClient;
    }

    getDatabaseClientHandler(): AbstractDatabaseClientHandler{
        return this._databaseClientHandler;
    }
}

function getBotSharedSingleton(): BotShared<Settings, User> {
    if (globalThis.__globalBotUtility == null) {
        const prismaDatabaseClientHandler = new PrismaClientDatabaseHandler();

        const monadInformation: CoinInformation = {
            name: "Monad",
            ticker: "MON_TEST",
        };

        const monadCoinClient = new MonadCoinClient();

        globalThis.__globalBotUtility = new BotShared(
            prismaDatabaseClientHandler,
            monadInformation,
            monadCoinClient
        );
    }

    return globalThis.__globalBotUtility;
}

export default getBotSharedSingleton;
