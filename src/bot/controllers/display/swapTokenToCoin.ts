import "dotenv/config";
import { MonadCoinClient } from "../../defined/MonadCoinClient";
import { formatNumber } from "../../../utils/menu_helpers/homedata";
import { PrismaClientDatabaseHandler } from "../../defined/PrismaDatabaseClientHandler";
import { BotContext } from "../../utils/BotUtility";

async function displaySwapSellToken_(ctx: BotContext, edit: boolean = false) {
    const tokenAddress = ctx.session.tokenAddress_selected;
    const userId = ctx.from?.id;

    if (!userId || !tokenAddress) {
        return;
    }

    const tokenDetails = await MonadCoinClient.fetchTokenMarketDetails(
        tokenAddress
    );
    const walletBalance = await MonadCoinClient.checkcoinBalance(
        ctx.user.user.walletPublicKey
    );

    const settings = await PrismaClientDatabaseHandler.getUserSettings(userId.toString());

    if (!settings) {
        return;
    }

    const selectedSellPercent =
        settings.selectedSellPercent <= 0
            ? settings.sellLeftPercentX
            : settings.selectedSellPercent;

    const selectedSlippage =
        settings.selectedSellSlippage <= 0
            ? settings.slippageSell
            : settings.selectedSellSlippage;

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
                    selectedSellPercent === settings.sellLeftPercentX
                        ? "✅ "
                        : ""
                }Sell ${settings.sellLeftPercentX}%`,
                callback_data: "swap_sellbutton_left_cb",
            },
            {
                text: `${
                    selectedSellPercent === settings.sellRightPercentX
                        ? "✅ "
                        : ""
                }Sell ${settings.sellRightPercentX}%`,
                callback_data: "swap_sellbutton_right_cb",
            },
            {
                text: `${
                    selectedSellPercent === settings.sellCustomX ? "✅ " : ""
                } Sell ${
                    settings.sellCustomX <= 0 ? "X" : settings.sellCustomX
                }% ✏️`,
                callback_data: "swap_sellbutton_x_cb",
            },
        ],
        [
            {
                text: `${
                    selectedSlippage === settings.slippageSell ? "✅ " : ""
                } ${settings.slippageSell}% Slippage`,
                callback_data: "sell_slippagebutton_cb",
            },
            {
                text: `${
                    selectedSlippage === settings.slippageSellCustom
                        ? "✅ "
                        : ""
                }${
                    settings.slippageSellCustom <= 0
                        ? "X"
                        : settings.slippageSellCustom
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

