import { CallbackQueryContext, Context } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";

import "dotenv/config";
import { BotContext } from "../../utils";
import { PrismaClient } from "@prisma/client";
import { TronClient } from "../../clients/tron";

export const start = async (ctx: BotContext) => {
  const userId = ctx.from?.id;

  if (!userId) {
    return;
  }

  const walletPb = ctx.session.user.walletPb;
  const tokensOwned = await TronClient.getTokensOwned(walletPb);

  console.log("tokensOwned");
  console.log(tokensOwned);

  const inlineKeyboard = [
    [
      {
        text: "Back",
        callback_data: "back_cb",
      },
      {
        text: "Refresh",
        callback_data: "refresh_tokens_owned_cb",
      },
    ],
    [
      {
        text: "TSig7s...Znb",
        callback_data: "sell_cb",
      },
    ],
  ];

  await ctx.reply(
    `
Select a token to sell 1/1
    `,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    }
  );
};
