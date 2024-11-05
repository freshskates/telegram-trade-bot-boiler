import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, LazySessionFlavor, Migrations, SessionFlavor } from "grammy";

/**
 * Session data is data that is stored in the database and is automatically saved to the database if any changes happen to that data.
 * This data is stored in a table called Session and all the data within this interface will be in JSON format and that
 * JSON data will be stored as a single string.
 *
 *
 * @export
 * @interface SessionData
 * @typedef {UserSessionData}
 */
export interface UserSessionData {
    tokenAddress_selected?: string;

    tokenSwapBuy_slippage_1: number;
    tokenSwapBuy_slippage_custom: number;  // Value is given by the user
    tokenSwapBuy_slippage_selected: number;  // Value selected by user

    tokenSwapBuy_amount_1: number;
    tokenSwapBuy_amount_2: number;
    tokenSwapBuy_amount_3: number;
    tokenSwapBuy_amount_4: number;
    tokenSwapBuy_amount_5: number;
    tokenSwapBuy_amount_custom: number;  // Value is given by the user
    tokenSwapBuy_amount_selected: number;  // Value selected by user

    swapSellToekn_selected_percent?: number;
    swapSellToken_selected_splippage?: number;
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
export function GetNewInitialSessionData(): UserSessionData {
    return {
        tokenSwapBuy_slippage_1: 19,
        tokenSwapBuy_slippage_custom: 0,
        tokenSwapBuy_slippage_selected: 0,

        tokenSwapBuy_amount_1: 100,
        tokenSwapBuy_amount_2: 500,
        tokenSwapBuy_amount_3: 1000,
        tokenSwapBuy_amount_4: 1000,
        tokenSwapBuy_amount_5: 5000,
        tokenSwapBuy_amount_custom: 0,
        tokenSwapBuy_amount_selected: 0,
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
        walletPb: string;
        walletPk: string;
    };

    settings: {
        gasFee: number;
        autoBuy: boolean;
        autoBuyTrx: number;
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
    selectedswapBuyAmountUpdated: boolean;
}

export type BotContext = Context &
    ConversationFlavor &
    SessionFlavor<UserSessionData> & { user: UserData } & { temp: TempData }; // Non lazySession way
    // LazySessionFlavor<SessionData> & { user: UserData } & { temp: TempData };

export type BotConversation = Conversation<BotContext>;
1