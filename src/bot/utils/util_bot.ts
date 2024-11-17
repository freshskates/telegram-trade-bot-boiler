import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, Migrations, SessionFlavor } from "grammy";

/**
 * User Session Data is data that is stored in the database and is automatically saved to the database if any changes happen to that data.
 * This data is stored in a table called Session and all the data within this interface will be in JSON format and that
 * JSON data will be stored as a single string.
 *
 * Notes:
 *      The data here should not be important or the data can be removed/not used/modified in such a way that
 *      it does not break major functionality.
 *
 *      Basically, data here should be on the level of importance of storing settings/options/preferences,
 *      but not on the level of importance of storing credit card information.
 *
 *
 * @export
 * @interface SessionData
 * @typedef {UserSessionData}
 */
export interface UserSessionData {
    /* ----- Token Related ----- */
    tokenAddress_selected?: string;

    /* ----- Buy Token (Coin to Token) ----- */

    swapCoinToToken_slippage_1: number; // Value can be given by the user
    swapCoinToToken_slippage_custom: number; // Value is given by the user
    swapCoinToToken_slippage_selected: number; // Value selected by user

    swapCoinToToken_amount_1: number; // Value can be given by the user
    swapCoinToToken_amount_2: number; // Value can be given by the user
    swapCoinToToken_amount_3: number; // Value can be given by the user
    swapCoinToToken_amount_4: number; // Value can be given by the user
    swapCoinToToken_amount_5: number; // Value can be given by the user
    swapCoinToToken_amount_custom: number; // Value is given by the user
    swapCoinToToken_amount_selected: number; // Value selected by user

    swapCoinToToken_gas_fee_1: number; // Value can be given by the user
    swapCoinToToken_gas_fee_2: number; // Value can be given by the user
    swapCoinToToken_gas_fee_3: number; // Value can be given by the user
    swapCoinToToken_gas_fee_custom: number; // Value is given by the user
    swapCoinToToken_gas_fee_selected: number; // Value selected by user

    /* ----- Auto Buy Token (Coin to Token) ----- */

    swapCoinToToken_auto_amount_custom: number; // Value is given by the user
    swapCoinToToken_auto_amount_selected: number; // Value selected by user
    swapCoinToToken_auto_amount_toggle: boolean;

    /* ----- Sell Token (Token to Coin)  ----- */

    swapTokenToCoin_slippage_1: number; // Value can be given by the user
    swapTokenToCoin_slippage_custom: number; // Value is given by the user
    swapTokenToCoin_slippage_selected: number; // Value selected by user

    swapTokenToCoin_amount_percent_1: number; // Value can be given by the user
    swapTokenToCoin_amount_percent_2: number; // Value can be given by the user
    swapTokenToCoin_amount_percent_custom: number; // Value can be given by the user
    swapTokenToCoin_amount_percent_selected: number; // Value selected by user

    swapTokenToCoin_gas_fee_1: number; // Value can be given by the user
    swapTokenToCoin_gas_fee_2: number; // Value can be given by the user
    swapTokenToCoin_gas_fee_3: number; // Value can be given by the user
    swapTokenToCoin_gas_fee_custom: number; // Value is given by the user
    swapTokenToCoin_gas_fee_selected: number; // Value selected by user
}

/**
 * Get new initial SessionData
 *
 * Notes:
 *      This function must always return a new object as stated in the docs
 *
 * Reference:
 *      Initial Session Data
 *          Date Today:
 *              10/29/2024
 *          Reference:
 *              https://grammy.dev/plugins/session#initial-session-data
 * @export
 * @returns {UserSessionData}
 */
export function getNewInitialSessionData(): UserSessionData {
    return {
        /* ----- Buy Token (Coin to Token) ----- */

        swapCoinToToken_slippage_1: 18,
        swapCoinToToken_slippage_custom: 0,
        swapCoinToToken_slippage_selected: 0,

        swapCoinToToken_amount_1: 100,
        swapCoinToToken_amount_2: 500,
        swapCoinToToken_amount_3: 1000,
        swapCoinToToken_amount_4: 1000,
        swapCoinToToken_amount_5: 5000,
        swapCoinToToken_amount_custom: 0,
        swapCoinToToken_amount_selected: 0,

        swapCoinToToken_gas_fee_1: 10,
        swapCoinToToken_gas_fee_2: 20,
        swapCoinToToken_gas_fee_3: 30,
        swapCoinToToken_gas_fee_custom: 0,
        swapCoinToToken_gas_fee_selected: 0,

        /* ----- Auto Buy Token (Coin to Token) ----- */

        swapCoinToToken_auto_amount_custom: 0,
        swapCoinToToken_auto_amount_selected: 0,
        swapCoinToToken_auto_amount_toggle: false,

        /* ----- Sell Token (Token to Coin)  ----- */

        swapTokenToCoin_slippage_1: 10,
        swapTokenToCoin_slippage_custom: 0,
        swapTokenToCoin_slippage_selected: 0,

        swapTokenToCoin_amount_percent_1: 10,
        swapTokenToCoin_amount_percent_2: 20,
        swapTokenToCoin_amount_percent_custom: 0,
        swapTokenToCoin_amount_percent_selected: 0,

        swapTokenToCoin_gas_fee_1: 10,
        swapTokenToCoin_gas_fee_2: 20,
        swapTokenToCoin_gas_fee_3: 30,
        swapTokenToCoin_gas_fee_custom: 0,
        swapTokenToCoin_gas_fee_selected: 0,
    };
}

/**
 * Get migration mapping
 *
 *  Reference:
 *      Migrations
 *          Date Today:
 *              10/31/2024
 *          Notes:
 *              Check the example here to know what t write in this function
 *          Reference:
 *              https://grammy.dev/plugins/session#migrations
 * @export
 * @returns {Migrations}
 */
export function getSessionMigration(): Migrations {
    return {};
}

/**
 * User Data is data that is obtained from database but IS NOT AUTOMATICALLY SAVED TO THE DATABASE WHEN DATA IS CHANGED.
 *
 * @export
 * @interface UserData
 * @typedef {UserData}
 */
export interface UserData {
    user: {
        walletPublicKey: string;
        walletPrivateKey: string;
    };

    settings: {
        // gasFee: number;
        // autoBuy: boolean;
        // autoBuyTrx: number;
    };

    // ////////////////// IGNORE THE BELOW
    // favoriteIds: string[];
    // good_one: number;
}

/**
 * Temporary data is data that will only exist for the current ctx, new succeeding ctx will not
 * have this data.
 *
 *
 * @interface TempData
 * @typedef {TempData}
 */
export interface TempData {
    shouldEditCurrentCTXMessage: boolean;

    /* 
    This is used to determine if a conversation method has returned a new ctx
    */
    conversationMethodReturnedANewCTX: boolean;  
}

export type BotContext = Context &
    ConversationFlavor &
    SessionFlavor<UserSessionData> & { user: UserData } & { temp: TempData }; // Non lazySession way
// LazySessionFlavor<SessionData> & { user: UserData } & { temp: TempData };

export type BotConversation = Conversation<BotContext>;
1;
