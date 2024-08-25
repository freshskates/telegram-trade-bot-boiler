import { CallbackQueryContext, Context } from "grammy";
import { BotContext, BotConversation } from "../utils";
import { PrismaClient } from "@prisma/client";

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
  const id = ctx.update.callback_query?.from.id;

  const prisma = new PrismaClient();

  const userSettings = await prisma.settings.findUnique({
    where: {
      userId: id.toString(),
    },
  });

  if (!userSettings) {
    await ctx.reply("No settings found for your account.");
    return;
  }

  // Use the settings values to populate the button labels
  const buyTopLeftX = userSettings.buyTopLeftX;
  const buyTopCenterX = userSettings.buyTopCenterX;
  const buyTopRightX = userSettings.buyTopRightX;
  const buyBottomLeftX = userSettings.buyBottomLeftX;
  const buyBottomRightX = userSettings.buyBottomRightX;

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
              callback_data: "set_gas_1_cb",
            },
            {
              text: "Normal 🚀",
              callback_data: "set_gas_2_cb",
            },
            {
              text: "Ultra 🦄",
              callback_data: "set_gas_3_cb",
            },
          ],
          [
            {
              text: `Custom:  ${userSettings.gasFee}TRX ✏️`,
              callback_data: "set_gas_x",
            },
          ],
          [{ text: "-- Buy Amounts --", callback_data: "empty" }],
          [
            {
              text: `${buyTopLeftX} TRX ✏️`,
              callback_data: "buy_button_tl_cb",
            },
            {
              text: `${buyTopCenterX} TRX ✏️`,
              callback_data: "buy_button_tc_cb",
            },
            {
              text: `${buyTopRightX} TRX ✏️`,
              callback_data: "buy_button_tr_cb",
            },
          ],
          [
            {
              text: `${buyBottomLeftX} TRX ✏️`,
              callback_data: "buy_button_bl_cb",
            },
            {
              text: `${buyBottomRightX} TRX ✏️`,
              callback_data: "buy_button_br_cb",
            },
          ],
          [
            {
              text: `Buy Slippage: ${userSettings.slippageBuy}% ✏️`,
              callback_data: "buy_setting_slippage_cb",
            },
          ],
          [{ text: "-- Sell Amounts --", callback_data: "empty" }],
          [
            {
              text: `${userSettings.sellLeftPercentX}% ✏️`,
              callback_data: "sell_percent_l_cb",
            },
            {
              text: `${userSettings.sellRightPercentX}% ✏️`,
              callback_data: "sell_percent_r_cb",
            },
          ],
          [
            {
              text: `Sell Slippage: ${userSettings.slippageSell}% ✏️`,
              callback_data: "sell_setting_slippage_cb",
            },
          ],
          [{ text: "Back", callback_data: "back_cb" }],
        ],
      },
    }
  );

  await ctx.answerCallbackQuery();
};
