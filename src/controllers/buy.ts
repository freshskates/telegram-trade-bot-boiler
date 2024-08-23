import { CallbackQueryContext, Context } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";

import base58 from "bs58";

import "dotenv/config";
import { BotContext } from "../utils";

type CusConversation = Conversation<BotContext>;

export const buyButtonConversation = async (
  conversation: CusConversation,
  ctx: BotContext
) => {
  const id = ctx.update.callback_query?.from.id;
};

export const buy = async (ctx: CallbackQueryContext<BotContext>) => {
  await ctx.conversation.exit();
  await ctx.conversation.reenter("buy");
  await ctx.answerCallbackQuery();
};

export const start = async (ctx: BotContext) => {
  console.log("ctx.session.selectedToken");
  console.log(ctx.session.selectedToken);

  await ctx.reply(
    `
Buy \$DRAWN — (drawn cat) 📈 [link](https://dexscreener.com/solana/9M53sMUqbZKyBhqrfPW6erZModxadJMFUtRJahJFpump?id=95977a2a) 
\`9M53sMUqbZKyBhqrfPW6erZModxadJMFUtRJahJFpump\`

Balance: *2.027 TRX* [link](https://t.me/helenus_trojanbot?start=walletMenu)
Price: *\$0.0005016* — LIQ: *\$80.53K* — MC: *\$501.55K*
30m: *-41.59%* — 24h: *818.75%*
Renounced ✅ | Not Rugged ✅

*8 SOL (\$1,146.62) ⇄ 2.21M DRAWN (\$1,109.80)*

Price Impact: *3.21%*
Liquidity SOL: *281.229* — DRAWN: *80.19M*
    `,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Back",
              callback_data: "test",
            },
            {
              text: "Refresh",
              callback_data: "test",
            },
          ],
          [
            {
              text: "Buy 0.5 TRX",
              callback_data: "test",
            },
            {
              text: "Buy 100 TRX",
              callback_data: "test",
            },
            {
              text: "Buy 200 TRX",
              callback_data: "test",
            },
          ],
          [
            {
              text: "Buy 1000 TRX",
              callback_data: "test",
            },
            {
              text: "Buy 5000 TRX",
              callback_data: "test",
            },
            {
              text: "Buy X TRX ✏️",
              callback_data: "test",
            },
          ],
          [
            {
              text: "✅ 2% Slippage",
              callback_data: "test",
            },
            {
              text: "X Slippage ✏️",
              callback_data: "test",
            },
          ],
          [
            {
              text: "swap",
              callback_data: "swap",
            },
          ],
        ],
      },
    }
  );
};
