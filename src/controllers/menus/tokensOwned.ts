import { CallbackQueryContext, Context } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";

import "dotenv/config";
import { BotContext } from "../../utils";
import { PrismaClient } from "@prisma/client";

export const start = async (ctx: BotContext) => {
  const userId = ctx.from?.id;

  if (!userId) {
    return;
  }

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
