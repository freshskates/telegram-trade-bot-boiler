import "dotenv/config";
import bot from "../bot_init";
import { BotContext } from "../utils/util_bot";
import {
  getGrammyUser,
  getTokenAddress,
  getTokenHeaderFormatted,
  getUserSettings,
} from "./utils/common";

async function get_swapTokenToCoin_HeaderFormatted(
  ctx: BotContext,
  tokenAddress: string
): Promise<string> {
  return getTokenHeaderFormatted(ctx, tokenAddress, "Sell");
}

async function swapTokenToCoin_(ctx: BotContext) {
  const [tokenAddress, grammyUser] = await Promise.all([
    getTokenAddress(ctx),
    getGrammyUser(ctx),
  ]);

  // const userId = ctx.update.callback_query?.from.id;
  const grammyUserId = grammyUser.id;

  const userSettings = await getUserSettings(grammyUserId);

  // This should reduce read/writes
  let ctx_session_cached = ctx.session;

  ctx.session.swapTokenToCoin_amount_percent_selected =
    ctx_session_cached.swapTokenToCoin_amount_percent_selected <= 0
      ? ctx_session_cached.swapTokenToCoin_amount_percent_1
      : ctx_session_cached.swapTokenToCoin_amount_percent_selected;

  ctx.session.swapTokenToCoin_slippage_selected =
    ctx_session_cached.swapTokenToCoin_slippage_selected <= 0
      ? ctx_session_cached.swapTokenToCoin_slippage_1
      : ctx_session_cached.swapTokenToCoin_slippage_selected;

  // This should reduce read/writes
  ctx_session_cached = ctx.session;

  const inlineKeyboard = [
    [
      {
        text: "Home",
        callback_data: "cb_root_home",
      },
      {
        text: "Refresh",
        callback_data: "cb_swapTokenToCoin_refresh",
      },
    ],
    [
      {
        text: `${
          ctx_session_cached.swapTokenToCoin_amount_percent_selected ===
          ctx_session_cached.swapTokenToCoin_amount_percent_1
            ? "✅ "
            : ""
        }Sell ${ctx_session_cached.swapTokenToCoin_amount_percent_1}%`,
        callback_data: "cb_swapTokenToCoin_amount_percent_VALUE_1",
      },
      {
        text: `${
          ctx_session_cached.swapTokenToCoin_amount_percent_selected ===
          ctx_session_cached.swapTokenToCoin_amount_percent_2
            ? "✅ "
            : ""
        }Sell ${ctx_session_cached.swapTokenToCoin_amount_percent_2}%`,
        callback_data: "cb_swapTokenToCoin_amount_percent_VALUE_2",
      },
      {
        text: `${
          ctx_session_cached.swapTokenToCoin_amount_percent_selected ===
          ctx_session_cached.swapTokenToCoin_amount_percent_custom
            ? "✅ "
            : ""
        }✏️ Sell ${
          ctx_session_cached.swapTokenToCoin_amount_percent_custom <= 0
            ? "X"
            : ctx_session_cached.swapTokenToCoin_amount_percent_custom
        }%`,
        callback_data: "cb_swapTokenToCoin_amount_percent_VALUE_custom",
      },
    ],
    [
      {
        text: `${
          ctx_session_cached.swapTokenToCoin_slippage_selected ===
          ctx_session_cached.swapTokenToCoin_slippage_1
            ? "✅ "
            : ""
        } ${ctx_session_cached.swapTokenToCoin_slippage_1}% Slippage`,
        callback_data: "cb_swapTokenToCoin_slippage_VALUE_1",
      },
      {
        text: `${
          ctx_session_cached.swapTokenToCoin_slippage_selected ===
          ctx_session_cached.swapTokenToCoin_slippage_custom
            ? "✅ "
            : ""
        }✏️ ${
          ctx_session_cached.swapTokenToCoin_slippage_custom <= 0
            ? "X"
            : ctx_session_cached.swapTokenToCoin_slippage_custom
        }% Slippage`,
        callback_data: "cb_swapTokenToCoin_slippage_VALUE_custom",
      },
    ],
    [
      {
        text: "Swap",
        callback_data: "swap_sell_cb",
      },
    ],
  ];

  if (
    !ctx.temp.shouldEditCurrentCTXMessage ||
    ctx.temp.conversationMethodReturnedANewCTX
  ) {
    await ctx.reply(
      await get_swapTokenToCoin_HeaderFormatted(ctx, tokenAddress),
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      }
    );
  } else {
    await ctx.editMessageText(
      await get_swapTokenToCoin_HeaderFormatted(ctx, tokenAddress),
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      }
    );
  }
}

async function cb_swapTokenToCoin_refresh(ctx: BotContext) {
  await ctx.conversation.exit(); // Exit any exist conversation to prevent buggy behavior
  await ctx.deleteMessage(); // Delete the most recent message relative to where this method was called
  await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

  await swapTokenToCoin_(ctx);
  await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_swapTokenToCoin_refresh", cb_swapTokenToCoin_refresh);

async function cb_swapTokenToCoin_ADDRESS_REGEX(ctx: BotContext) {
  // TODO: FIX THIS SHIT, I DON'T THINK THERE WILL BE ERRORS ASSUMING SHIT IS WRITTEN CORRECTLY
  if (ctx.match == null) {
    return;
  }

  const tokenAddress = ctx.match[1];
  console.log(`Token Address: ${tokenAddress}`);

  ctx.session.tokenAddress_selected = tokenAddress;

  await swapTokenToCoin_(ctx);
  await ctx.answerCallbackQuery();
}

bot.callbackQuery(/cb_sTTC_ADDRESS_([^\s]+)/, cb_swapTokenToCoin_ADDRESS_REGEX);

/* 
**************************************************
Exporting
**************************************************
*/

const swapTokenToCoin = {
  swapTokenToCoin: swapTokenToCoin_,
};
export { swapTokenToCoin };
