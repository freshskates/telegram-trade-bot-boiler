import "dotenv/config";
import { MonadCoinClient } from "../defined/MonadCoinClient";
import bot from "../bot_init";
import { BotContext } from "../utils/BotUtility";
import { WalletClient } from "../../clients/wallet";
import { TokenPosition } from "../../utils";

function _createTokenInlineKeyboard(tokens: TokenPosition[]) {
  const maxRows = 6;
  const inlineKeyboard = [];

  // Add the dynamic token buttons
  for (
    let i = 0;
    i < tokens.length && inlineKeyboard.length < maxRows;
    i += 2
  ) {
    const row = [];

    // Format token symbol and address
    const formatTokenSymbol = tokens[i].symbol.slice(0, 4);
    const formatTokenAddress = `${tokens[i].address.slice(0, 3)}...${tokens[
      i
    ].address.slice(-2)}`;

    row.push({
      text: `${formatTokenSymbol} - ${formatTokenAddress}`,
      callback_data: `token_${tokens[i].address}_cb`,
    });

    if (i + 1 < tokens.length) {
      const formatTokenSymbolNext = tokens[i + 1].symbol.slice(0, 4);
      const formatTokenAddressNext = `${tokens[i + 1].address.slice(
        0,
        3
      )}...${tokens[i + 1].address.slice(-2)}`;

      row.push({
        text: `${formatTokenSymbolNext} - ${formatTokenAddressNext}`,
        callback_data: `token_${tokens[i + 1].address}_cb`,
      });
    }

    inlineKeyboard.push(row);
  }

  return inlineKeyboard;
}

async function cb_tokens_owned(ctx: BotContext) {
  const userId = ctx.from?.id;

  if (!userId) {
    return;
  }

  const walletPb = ctx.session.user.walletPb;
  const tokensOwned = await WalletClient.getOwnedTokens(walletPb);

  console.log("tokensOwned");
  console.log(tokensOwned);

  const inlineKeyboard = [
    [
      {
        text: "Back",
        callback_data: "cb_restart",
      },
      {
        text: "Refresh",
        callback_data: "refresh_cb_tokens_owned",
      },
    ],
    ..._createTokenInlineKeyboard(tokensOwned.tokens),
    [
      {
        text: "Prev Page",
        callback_data: "cb_prev_page",
      },
      {
        text: "Next Page",
        callback_data: "next_page_cb",
      },
    ],
  ];

  await ctx.reply(
    `
Select a token to sell ${tokensOwned.tokens.length}/${tokensOwned.tokens.length}
    `,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    }
  );
}
bot.callbackQuery("cb_root_swapSellToken", cb_tokens_owned);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
