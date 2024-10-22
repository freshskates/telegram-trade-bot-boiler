import { CallbackQueryContext } from "grammy";

import "dotenv/config";
import { MonadClient } from "../../clients/monad";
import getPrismaClientSingleton from "../../services/prisma_client_singleton";
import { BotContext } from "../../utils";
import { formatNumber } from "../../utils/menu_helpers/homedata";
2;
import bot from "../bot_init";
import { UserClient } from "../../clients/user";

async function buyTrx (ctx: BotContext, edit: boolean = false) {
  const tokenAddress = ctx.session.selectedToken;
  const userId = ctx.from?.id;

  if (!userId || !tokenAddress) {
    return;
  }

  const tokenDetails = await MonadClient.fetchTokenMarketDetails(tokenAddress);
  const walletBalance = await MonadClient.checkMonadBalance(
    ctx.session.user.walletPb
  );

  const settings = await UserClient.getUserSettings(userId.toString());

  if (!settings) {
    return;
  }

  ctx.session.buyamount =
    settings.selectedBuy <= 0 ? settings.buyTopLeftX : settings.selectedBuy;

  ctx.session.buyslippage =
    settings.selectedBuySlippage <= 0
      ? settings.slippageBuy
      : settings.selectedBuySlippage;


  console.log(settings)
  console.log("ctx.session.buyamount ctx.session.buyslippage:",ctx.session.buyamount, ctx.session.buyslippage)

  const inlineKeyboard = [
    [
      {
        text: "Back",
        callback_data: "cb_restart",
      },
      {
        text: "Refresh",
        callback_data: "refresh_buy_page_cb",
      },
    ],
    [
      {
        text: `${ctx.session.buyamount === settings.buyTopLeftX ? "✅ " : ""}Buy ${
          settings.buyTopLeftX
        } MON`,
        callback_data: "cb_swap_buybutton_tl",
      },
      {
        text: `${
          ctx.session.buyamount === settings.buyTopCenterX ? "✅ " : ""
        }Buy ${settings.buyTopCenterX} MON`,
        callback_data: "cb_swap_buybutton_tc",
      },
      {
        text: `${ctx.session.buyamount === settings.buyTopRightX ? "✅ " : ""}Buy ${
          settings.buyTopRightX
        } MON`,
        callback_data: "cb_swap_buybutton_tr",
      },
    ],
    [
      {
        text: `${
          ctx.session.buyamount === settings.buyBottomLeftX ? "✅ " : ""
        }Buy ${settings.buyBottomLeftX} MON`,
        callback_data: "cb_swap_buybutton_bl",
      },
      {
        text: `${
          ctx.session.buyamount === settings.buyBottomRightX ? "✅ " : ""
        }Buy ${settings.buyBottomRightX} MON`,
        callback_data: "cb_swap_buybutton_br",
      },
      {
        text: `${ctx.session.buyamount === settings.buyCustomX ? "✅ " : ""}Buy ${
          settings.buyCustomX <= 0 ? "X" : settings.buyCustomX
        } MON ✏️`,
        callback_data: "cb_swap_buybutton_x",
      },
    ],
    [
      {
        text: `${ctx.session.buyslippage === settings.slippageBuy ? "✅ " : ""}${
          settings.slippageBuy
        }% Slippage`,
        callback_data: "cb_buy_slippagebutton",
      },
      {
        text: `${ctx.session.buyslippage === settings.slippageBuyCustom ? "✅ " : ""}${
          settings.slippageBuyCustom <= 0 ? "X%" : settings.slippageBuyCustom
        }% Slippage ✏️`,
        callback_data: "cb_buy_slippagebutton_x",
      },
    ],
    [
      {
        text: "Swap",
        callback_data: "cb_swap_buy",
      },
    ],
  ];

  const headerText = `
Buy \$${
    tokenDetails.token.name
  } [📈](https://dexscreener.com/tron/tz4ur8mfkfykuftmsxcda7rs3r49yy2gl6) 
\`${tokenAddress}\`
  
Balance: *${walletBalance.monadBalance} MONAD* 
Price: *\$${formatNumber(
    tokenDetails.token.priceInUsd
  )}* — VOL: *\$${formatNumber(
    tokenDetails.token.volume24h
  )}* — MC: *\$${formatNumber(tokenDetails.token.marketCap)}*
  
// insert quote details here
        `;

  if (!edit) {
    await ctx.reply(headerText, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  } else {
    await ctx.editMessageText(headerText, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  }
};

const buy = {
  buyTrx: buyTrx,
};

export { buy };

/* 
**************************************************
Something about buying idk   
**************************************************
*/


// TODO: CallbackQueryContext<BotContext> IS THAT CORRECT? IDK
async function cb_buy(ctx: BotContext) {
  return await ctx.reply(
    "Enter a valid Monad token address:\n(temp example: TUFonyWZ4Tza5MzgDj6g2u5rfdGoRVYG7g)"
  );
}

bot.callbackQuery("cb_buy", cb_buy);


// TODO: DON"T KNOW WHAT THIS IS
async function load_token(ctx: BotContext) {
    if (!ctx?.message?.text) return;
  
    const token = ctx?.message.text?.trim();
    ctx.session.selectedToken = token;
  
    return await buyTrx(ctx);
  }
  
bot.hears(/^T[a-zA-Z0-9]{33}$/, load_token);
  
// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
