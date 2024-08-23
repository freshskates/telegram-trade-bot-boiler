import { CallbackQueryContext, Context } from "grammy";
import { BotContext, BotConversation } from "../utils";

export const buybutton = async (ctx: CallbackQueryContext<BotContext>) => {
  await ctx.conversation.exit();
  await ctx.conversation.reenter("buybutton");
  await ctx.answerCallbackQuery();
};

export const buyButtonConversation = async (
  conversation: BotConversation,
  ctx: BotContext
) => {
  const id = ctx.update.callback_query?.from.id;

  // const user =
};

export const start = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.reply(
    `
💰Fee Discount: You are receiving a 10% discount on trading fees for being a referral of another user.
    `,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "-- Gas Fees --", callback_data: "empty" }],
          [
            {
              text: "Economy 🐴",
              callback_data: "set_gas_1",
            },
            {
              text: "Normal 🚀",
              callback_data: "set_gas_2",
            },
            {
              text: "Ultra 🦄",
              callback_data: "set_gas_3",
            },
          ],
          [
            {
              text: "Custom:  1000TRX ✏️",
              callback_data: "set_gas_x",
            },
          ],
          [{ text: "-- Buy Amounts --", callback_data: "empty" }],
          [
            {
              text: "1000 TRX ✏️",
              callback_data: "buy_button_tl",
            },
            {
              text: "5000 TRX ✏️",
              callback_data: "buy_button_tc",
            },
            {
              text: "10000 TRX ✏️",
              callback_data: "buy_button_tr",
            },
          ],
          [
            {
              text: "1 TRX ✏️",
              callback_data: "buy_button_bl",
            },
            {
              text: "100 TRX ✏️",
              callback_data: "buy_button_br",
            },
          ],
          [
            {
              text: "Buy Slippage: 2% ✏️",
              callback_data: "buy_5000",
            },
          ],
          [{ text: "-- Sell Amounts --", callback_data: "empty" }],
          [
            { text: "0.5% ✏️", callback_data: "referrals" },
            { text: "10% ✏️", callback_data: "settings" },
          ],
          [
            {
              text: "Sell Slippage: 15% ✏️",
              callback_data: "buy_5000",
            },
          ],
          [{ text: "Back", callback_data: "back" }],
        ],
      },
    }
  );

  await ctx.answerCallbackQuery();
};
