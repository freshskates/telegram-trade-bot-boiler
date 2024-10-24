import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, SessionFlavor } from "grammy";

interface SessionData {
    user: {
        walletPb: string;
        walletPk: string;
    };
    settings: {
        gasFee: number;
        autoBuy: boolean;
        autoBuyTrx: number;
    };
    selectedToken?: string;
    buyslippage?: number;
    buyamount?: number;
    sellpercent?: number;
    sellslippage?: number;

    swapBuyTokenUpdated: boolean;

    ////////////////// IGNORE THE BELOW 
    favoriteIds: string[];
    
}

export type BotContext = (
    Context &
    ConversationFlavor &
    SessionFlavor<SessionData>
);
export type BotConversation = Conversation<BotContext>;
