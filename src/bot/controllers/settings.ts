import { createConversation } from "@grammyjs/conversations";
import { CallbackQueryContext, Context } from "grammy";
import bot from "../bot_init";
import getPrismaDatabaseClientSingleton from "../defined/PrismaDatabaseClient";
import { BotContext, BotConversation } from "../../utils";

const PRISMA_CLIENT = getPrismaDatabaseClientSingleton();

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


  const ctx_session_cached = ctx.session

  // Use the settings values to populate the button labels
  const buyTokenTopLeftX = ctx_session_cached.swapCoinToToken_amount_1;
  const buyTokenTopCenterX = ctx_session_cached.swapCoinToToken_amount_2;
  const buyTokenTopRightX = ctx_session_cached.swapCoinToToken_amount_3;
  const buyTokenBottomLeftX = ctx_session_cached.swapCoinToToken_amount_4;
  const buyTokenBottomRightX = ctx_session_cached.swapCoinToToken_amount_5;
  const buyTokenSlippage = ctx_session_cached.swapCoinToToken_slippage_selected;
  const sellTokenAmountPrecent_1 = ctx_session_cached.swapTokenToCoin_amount_percent_1;
  const sellTokenAmountPrecent_2 = ctx_session_cached.swapTokenToCoin_amount_percent_1d;
  const sellTokenSlippage = ctx_session_cached.swapTokenToCoin_slippage_selected;

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
              text: `${buyTokenTopLeftX} TRX ✏️`,
              callback_data: "cb_buy_button_tl",
            },
            {
              text: `${buyTokenTopCenterX} TRX ✏️`,
              callback_data: "cb_buy_button_tc",
            },
            {
              text: `${buyTokenTopRightX} TRX ✏️`,
              callback_data: "cb_buy_button_tr",
            },
          ],
          [
            {
              text: `${buyTokenBottomLeftX} TRX ✏️`,
              callback_data: "cb_buy_button_bl",
            },
            {
              text: `${buyTokenBottomRightX} TRX ✏️`,
              callback_data: "cb_buy_button_br",
            },
          ],
          [
            {
              text: `Buy Slippage: ${buyTokenSlippage}% ✏️`,
              callback_data: "cb_buy_setting_slippage",
            },
          ],
          [{ text: "-- Sell Amounts --", callback_data: "empty" }],
          [
            {
              text: `${sellTokenAmountPrecent_1}% ✏️`,
              callback_data: "cb_sell_percent_l",
            },
            {
              text: `${sellTokenAmountPrecent_2}% ✏️`,
              callback_data: "cb_sell_percent_r",
            },
          ],
          [
            {
              text: `Sell Slippage: ${sellTokenSlippage}% ✏️`,
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


bot.callbackQuery("cb_root_settings", cb_settings);
// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
