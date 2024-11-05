import "dotenv/config";
import { MonadClient } from "../../../clients/monad";
import { BotContext, TokenMarketDetails, UserSessionData } from "../../../utils";
import { formatNumber } from "../../../utils/menu_helpers/homedata";
import bot from "../../bot_init";
import { Session } from "inspector/promises";


// async function _getHeader(tokenDetails: TokenMarketDetails, walletBalance: number): Promise<string> {
// }

async function tokenSwapBuy_(ctx: BotContext) {
    const tokenAddress = ctx.session.tokenAddress_selected;
    const userId = ctx.from?.id; // Gets the author of the message, callback query, or other things

    if (!userId || !tokenAddress) {
        return;
    }

    const tokenDetails = await MonadClient.fetchTokenMarketDetails(
        tokenAddress
    );
    const walletBalance = await MonadClient.checkMonadBalance(
        ctx.user.user.walletPb
    );

    // const userSettings = await UserClient.getUserSettings(userId.toString());

    // if (!userSettings) {
    //     return;
    // }

    ctx.session.tokenSwapBuy_amount_selected =
        ctx.session.tokenSwapBuy_amount_selected <= 0
            ? ctx.session.tokenSwapBuy_amount_1
            : ctx.session.tokenSwapBuy_amount_selected;

    ctx.session.tokenSwapBuy_slippage_selected =
        ctx.session.tokenSwapBuy_slippage_selected <= 0
            ? ctx.session.tokenSwapBuy_slippage_1
            : ctx.session.tokenSwapBuy_slippage_selected;

    const inlineKeyboard = [
        [
            {
                text: "Back",
                callback_data: "cb_restart",
            },
            {
                text: "Refresh",
                callback_data: "cb_tokenSwapBuy_refresh",
            },
        ],
        [
            {
                text: `${
                    ctx.session.tokenSwapBuy_amount_selected ===
                    ctx.session.tokenSwapBuy_amount_1
                        ? "✅ "
                        : ""
                }Buy ${ctx.session.tokenSwapBuy_amount_1} MON`,
                callback_data: "cb_tokenSwapBuy_amount_LOCATION_0_0",
            },
            {
                text: `${
                    ctx.session.tokenSwapBuy_amount_selected ===
                    ctx.session.tokenSwapBuy_amount_2
                        ? "✅ "
                        : ""
                }Buy ${ctx.session.tokenSwapBuy_amount_2} MON`,
                callback_data: "cb_tokenSwapBuy_amount_LOCATION_0_1",
            },
            {
                text: `${
                    ctx.session.tokenSwapBuy_amount_selected ===
                    ctx.session.tokenSwapBuy_amount_3
                        ? "✅ "
                        : ""
                }Buy ${ctx.session.tokenSwapBuy_amount_3} MON`,
                callback_data: "cb_tokenSwapBuy_amount_LOCATION_0_2",
            },
        ],
        [
            {
                text: `${
                    ctx.session.tokenSwapBuy_amount_selected ===
                    ctx.session.tokenSwapBuy_amount_4
                        ? "✅ "
                        : ""
                }Buy ${ctx.session.tokenSwapBuy_amount_4} MON`,
                callback_data: "cb_tokenSwapBuy_amount_LOCATION_1_0",
            },
            {
                text: `${
                    ctx.session.tokenSwapBuy_amount_selected ===
                    ctx.session.tokenSwapBuy_amount_5
                        ? "✅ "
                        : ""
                }Buy ${ctx.session.tokenSwapBuy_amount_5} MON`,
                callback_data: "cb_tokenSwapBuy_amount_LOCATION_1_1",
            },
            {
                text: `${
                    ctx.session.tokenSwapBuy_amount_selected ===
                    ctx.session.tokenSwapBuy_amount_custom
                        ? "✅ "
                        : ""
                }Buy ${
                    ctx.session.tokenSwapBuy_amount_custom <= 0
                        ? "X"
                        : ctx.session.tokenSwapBuy_amount_custom
                } MON ✏️`,
                callback_data: "cb_tokenSwapBuy_amount_LOCATION_CUSTOM",
            },
        ],
        [
            {
                text: `${
                    ctx.session.tokenSwapBuy_slippage_selected ===
                    ctx.session.tokenSwapBuy_slippage_1
                        ? "✅ "
                        : ""
                }${ctx.session.tokenSwapBuy_slippage_1}% Slippage`,
                callback_data: "cb_tokenSwapBuy_slippage",
            },
            {
                text: `${
                    ctx.session.tokenSwapBuy_slippage_selected ===
                    ctx.session.tokenSwapBuy_slippage_custom
                        ? "✅ "
                        : ""
                }${
                    ctx.session.tokenSwapBuy_slippage_custom <= 0
                        ? "X%"
                        : ctx.session.tokenSwapBuy_slippage_custom
                }% Slippage ✏️`,
                callback_data: "cb_tokenSwapBuy_slippage_x",
            },
        ],
        [
            {
                text: "Swap",
                callback_data: "cb_tokenSwapBuy_swap",
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


    // This condition will catch false, null, and undefined
    if (!ctx.temp.selectedswapBuyAmountUpdated) {
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
}

const tokenSwapBuy = {
    tokenSwapBuy: tokenSwapBuy_,
};

export { tokenSwapBuy };

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

bot.callbackQuery("cb_root_tokenSwapBuy", cb_buy);

// TODO: CHANGE THIS FROM REGEX TO A CONVERSATION
async function load_token(ctx: BotContext) {
    if (!ctx?.message?.text) return;

    const token = ctx?.message.text?.trim();
    ctx.session.tokenAddress_selected = token;

    console.log("Printing ctx.temp");
    console.log(ctx.temp);
    console.log("Printing ctx.");
    console.log(ctx);

    return await tokenSwapBuy_(ctx);
}

bot.hears(/^T[a-zA-Z0-9]{33}$/, load_token);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
