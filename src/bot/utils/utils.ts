import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, SessionFlavor } from "grammy";

/**
 * Session data is data that is stored in the database and is automatically saved to the database if any changes happen to that data.
 * This data is stored in a table called Session and all the data within this interface will be in JSON format and that
 * JSON data will be stored as a single string.
 *
 *
 * @export
 * @interface SessionData
 * @typedef {SessionData}
 */
export interface SessionData {
    selectedTokenAddress?: string;

    swapBuyToken_slippage_1: number;
    swapBuyToken_slippage_custom: number;
    swapBuyToken_slippage_selected: number;

    swapBuyToken_amount_1: number;
    swapBuyToken_amount_2: number;
    swapBuyToken_amount_3: number;
    swapBuyToken_amount_4: number;
    swapBuyToken_amount_5: number; // buyTopLeftX
    swapBuyToken_amount_custom: number;
    swapBuyToken_amount_selected: number;

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
 * @returns {SessionData}
 */
export function GetNewInitialSessionData(): SessionData {
    return {
        swapBuyToken_slippage_1: 19,
        swapBuyToken_slippage_custom: 0,
        swapBuyToken_slippage_selected: 0,

        swapBuyToken_amount_1: 100,
        swapBuyToken_amount_2: 500,
        swapBuyToken_amount_3: 1000,
        swapBuyToken_amount_4: 1000,
        swapBuyToken_amount_5: 5000,
        swapBuyToken_amount_custom: 0,
        swapBuyToken_amount_selected: 0,
    };
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
    SessionFlavor<SessionData> & { user: UserData } & { temp: TempData }; // This will make the property name "session"
export type BotConversation = Conversation<BotContext>;
