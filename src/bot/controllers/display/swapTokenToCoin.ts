import "dotenv/config";
import { formatNumber } from "../../../utils/menu_helpers/homedata";
import getBotSharedSingleton from "../../defined/BotShared";
import { BotContext } from "../../utils/bot_utility";

async function displaySwapSellToken_(ctx: BotContext, edit: boolean = false) {
    const tokenAddress = ctx.session.tokenAddress_selected;
    const userId = ctx.from?.id;

    if (!userId || !tokenAddress) {
        return;
    }

    const tokenDetails = await getBotSharedSingleton()
        .getCoinClient()
        .getTokenMarketDetails(tokenAddress);
    const walletBalance = await getBotSharedSingleton()
        .getCoinClient()
        .getCoinWalletBalance(ctx.user.user.walletPublicKey);

    // const settings = await getBotSharedSingleton().getDatabaseClientHandler().getUserSettings(userId.toString());

    // if (!settings) {
    //     return;
    // }

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
    ctx_session_cached = ctx.session

    const inlineKeyboard = [
        [
            {
                text: "Back",
                callback_data: "cb_restart",
            },
            {
                text: "Refresh",
                callback_data: "refresh_sell_page_cb",
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
                callback_data: "swap_sellbutton_left_cb",
            },
            {
                text: `${
                    ctx_session_cached.swapTokenToCoin_amount_percent_selected ===
                    ctx_session_cached.swapTokenToCoin_amount_percent_2
                        ? "✅ "
                        : ""
                }Sell ${ctx_session_cached.swapTokenToCoin_amount_percent_2}%`,
                callback_data: "swap_sellbutton_right_cb",
            },
            {
                text: `${
                    ctx_session_cached.swapTokenToCoin_amount_percent_selected ===
                    ctx_session_cached.swapTokenToCoin_amount_percent_custom
                        ? "✅ "
                        : ""
                } Sell ${
                    ctx_session_cached.swapTokenToCoin_amount_percent_custom <=
                    0
                        ? "X"
                        : ctx_session_cached.swapTokenToCoin_amount_percent_custom
                }% ✏️`,
                callback_data: "swap_sellbutton_x_cb",
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
                callback_data: "sell_slippagebutton_cb",
            },
            {
                text: `${
                    ctx_session_cached.swapTokenToCoin_slippage_selected ===
                    ctx_session_cached.swapTokenToCoin_slippage_custom
                        ? "✅ "
                        : ""
                }${
                    ctx_session_cached.swapTokenToCoin_slippage_custom <= 0
                        ? "X"
                        : ctx_session_cached.swapTokenToCoin_slippage_custom
                }% Slippage ✏️`,
                callback_data: "cb_sell_slippagebutton_x",
            },
        ],
        [
            {
                text: "Swap",
                callback_data: "swap_sell_cb",
            },
        ],
    ];

    if (!edit) {
        await ctx.reply(
            `
Sell ${
                tokenDetails.token.name
            } [📉](https://dexscreener.com/tron/tz4ur8mfkfykuftmsxcda7rs3r49yy2gl6) 
\`${tokenAddress}\`
  
Balance: *${walletBalance.coinBalance} MONAD* 
Price: *\$${formatNumber(
                tokenDetails.token.priceInUsd
            )}* — VOL: *\$${formatNumber(
                tokenDetails.token.volume24h
            )}* — MC: *\$${formatNumber(tokenDetails.token.marketCap)}*
  
// insert quote details here
        `,
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: inlineKeyboard,
                },
            }
        );
    } else {
        await ctx.editMessageText(
            `
Sell \$${
                tokenDetails.token.name
            } [📉](https://dexscreener.com/tron/tz4ur8mfkfykuftmsxcda7rs3r49yy2gl6) 
\`${tokenAddress}\`

Balance: *${walletBalance} MONAD* 
Price: *\$${formatNumber(
                tokenDetails.token.priceInUsd
            )}* — VOL: *\$${formatNumber(
                tokenDetails.token.volume24h
            )}* — MC: *\$${formatNumber(tokenDetails.token.marketCap)}*

// insert quote details here
        `,
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: inlineKeyboard,
                },
            }
        );
    }
}

const sell = {
    start: displaySwapSellToken_,
};
export { sell };

