import { createConversation } from "@grammyjs/conversations";
import { CallbackQueryContext, Context } from "grammy";
import bot from "../bot_init";
import getPrismaClientSingleton from "../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../utils";

const PRISMA_CLIENT = getPrismaClientSingleton();

async function cb_buybutton(ctx: CallbackQueryContext<BotContext>) {
  await ctx.conversation.exit();
  await ctx.conversation.reenter("conversation_buyButton");
  await ctx.answerCallbackQuery();
}
// WARNING: NOT FUCKING USED
bot.callbackQuery("cb_buybutton", cb_buybutton); // TODO: "cb_buybutton" is never called

async function conversation_buyButton(
  conversation: BotConversation,
  ctx: BotContext
) {
  const id = ctx.update.callback_query?.from.id;

  // const user =
  console.log("FUCK");
}
// WARNING: NOT FUCKING USED
bot.use(
  createConversation(
    conversation_buyButton,
    "conversation_buyprompt" // TODO: "conversation_buyprompt" is never used
  )
);
bot.use(createConversation(conversation_buyButton, "conversation_buyButton"));

export async function cb_settings(ctx: BotContext) {
  const id = ctx.update.callback_query?.from.id;

  // FIXME: HJOSEOPH
  if (!id) {
    return;
  }

  const userSettings = await PRISMA_CLIENT.settings.findUnique({
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
              callback_data: "cb_set_gas_1",
            },
            {
              text: "Normal 🚀",
              callback_data: "cb_set_gas_2",
            },
            {
              text: "Ultra 🦄",
              callback_data: "cb_set_gas_3",
            },
          ],
          [
            {
              text: `Custom:  ${userSettings.gasFee}TRX ✏️`,
              callback_data: "cb_set_gas_x",
            },
          ],
          [{ text: "-- Buy Amounts --", callback_data: "empty" }],
          [
            {
              text: `${buyTopLeftX} TRX ✏️`,
              callback_data: "cb_buy_button_tl",
            },
            {
              text: `${buyTopCenterX} TRX ✏️`,
              callback_data: "cb_buy_button_tc",
            },
            {
              text: `${buyTopRightX} TRX ✏️`,
              callback_data: "cb_buy_button_tr",
            },
          ],
          [
            {
              text: `${buyBottomLeftX} TRX ✏️`,
              callback_data: "cb_buy_button_bl",
            },
            {
              text: `${buyBottomRightX} TRX ✏️`,
              callback_data: "cb_buy_button_br",
            },
          ],
          [
            {
              text: `Buy Slippage: ${userSettings.slippageBuy}% ✏️`,
              callback_data: "cb_buy_setting_slippage",
            },
          ],
          [{ text: "-- Sell Amounts --", callback_data: "empty" }],
          [
            {
              text: `${userSettings.sellLeftPercentX}% ✏️`,
              callback_data: "cb_sell_percent_l",
            },
            {
              text: `${userSettings.sellRightPercentX}% ✏️`,
              callback_data: "cb_sell_percent_r",
            },
          ],
          [
            {
              text: `Sell Slippage: ${userSettings.slippageSell}% ✏️`,
              callback_data: "cb_sell_setting_slippage",
            },
          ],
          [{ text: "Back", callback_data: "cb_restart" }],
        ],
      },
    }
  );

  await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_settings", cb_settings);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
