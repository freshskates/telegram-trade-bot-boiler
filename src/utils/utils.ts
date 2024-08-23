import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, SessionFlavor } from "grammy";

interface SessionData {
  user: {
    walletPb: string;
    walletPk: string;
  };
  settings?: {
    gasFee: number;
    autoBuy: boolean;
    autoBuyTrx: number;
  };
  selectedToken?: string;
}

export type BotContext = Context &
  ConversationFlavor &
  SessionFlavor<SessionData>;
export type BotConversation = Conversation<BotContext>;
