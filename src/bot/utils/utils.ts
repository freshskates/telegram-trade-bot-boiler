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
export interface SessionData{

    tokenAddressSelected?: string;
    selectedBuySwapSlippage?: number;
    selectedBuySwapAmount?: number;
    selectedSellSwapPercent?: number;
    selectedSellSwapSplippage?: number;
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
 * Temporary data is data that will only exist for the current ctx, any new ctx or succeeding ctx will not
 * have this data.
 *  
 *
 * @interface TempData
 * @typedef {TempData}
 */
interface TempData {
    swapBuyTokenUpdated: boolean;
}

export type BotContext = (
    Context &
    ConversationFlavor &
    SessionFlavor<SessionData> &
    {user: UserData} &
    {temp: TempData} 
);
export type BotConversation = Conversation<BotContext>;
