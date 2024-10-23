import "dotenv/config";
import { MonadClient } from "../../clients/monad";
import { UserClient } from "../../clients/user";
import { BotContext } from "../../utils";
import { formatNumber } from "../../utils/menu_helpers/homedata";
import bot from "../bot_init";




async function displayBuyToken(ctx: BotContext, edit: boolean = false) {
    const tokenAddress = ctx.session.selectedToken;
    const userId = ctx.from?.id;

    if (!userId || !tokenAddress) {
        return;
    }

    const tokenDetails = await MonadClient.fetchTokenMarketDetails(
        tokenAddress
    );
    const walletBalance = await MonadClient.checkMonadBalance(
        ctx.session.user.walletPb
    );

    const userSettings = await UserClient.getUserSettings(userId.toString());

    if (!userSettings) {
        return;
    }

    ctx.session.buyamount =
        userSettings.selectedBuy <= 0 ? userSettings.buyTopLeftX : userSettings.selectedBuy;

    ctx.session.buyslippage =
        userSettings.selectedBuySlippage <= 0
            ? userSettings.slippageBuy
            : userSettings.selectedBuySlippage;

    const inlineKeyboard = [
        [
            {
                text: "Back",
                callback_data: "cb_restart",
            },
            {
                text: "Refresh",
                callback_data: "cb_swap_refresh",

            },
        ],
        [
            {
                text: `${
                    ctx.session.buyamount === userSettings.buyTopLeftX ? "✅ " : ""
                }Buy ${userSettings.buyTopLeftX} MON`,
                callback_data: "cb_buyToken_tl",
            },
            {
                text: `${
                    ctx.session.buyamount === userSettings.buyTopCenterX
                        ? "✅ "
                        : ""
                }Buy ${userSettings.buyTopCenterX} MON`,
                callback_data: "cb_buyToken_tc",
            },
            {
                text: `${
                    ctx.session.buyamount === userSettings.buyTopRightX ? "✅ " : ""
                }Buy ${userSettings.buyTopRightX} MON`,
                callback_data: "cb_buyToken_tr",
            },
        ],
        [
            {
                text: `${
                    ctx.session.buyamount === userSettings.buyBottomLeftX
                        ? "✅ "
                        : ""
                }Buy ${userSettings.buyBottomLeftX} MON`,
                callback_data: "cb_buyToken_bl",
            },
            {
                text: `${
                    ctx.session.buyamount === userSettings.buyBottomRightX
                        ? "✅ "
                        : ""
                }Buy ${userSettings.buyBottomRightX} MON`,
                callback_data: "cb_buyToken_br",
            },
            {
                text: `${
                    ctx.session.buyamount === userSettings.buyCustomX ? "✅ " : ""
                }Buy ${
                    userSettings.buyCustomX <= 0 ? "X" : userSettings.buyCustomX
                } MON ✏️`,
                callback_data: "cb_buyToken_x",
            },
        ],
        [
            {
                text: `${
                    ctx.session.buyslippage === userSettings.slippageBuy
                        ? "✅ "
                        : ""
                }${userSettings.slippageBuy}% Slippage`,
                callback_data: "cb_buy_slippagebutton",
            },
            {
                text: `${
                    ctx.session.buyslippage === userSettings.slippageBuyCustom
                        ? "✅ "
                        : ""
                }${
                    userSettings.slippageBuyCustom <= 0
                        ? "X%"
                        : userSettings.slippageBuyCustom
                }% Slippage ✏️`,
                callback_data: "cb_buy_slippagebutton_x",
            },
        ],
        [
            {
                text: "Buy",
                callback_data: "cb_buy_buy",
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
}

const buy = {
    displayBuyToken: displayBuyToken,
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

    return await displayBuyToken(ctx);
}

bot.hears(/^T[a-zA-Z0-9]{33}$/, load_token);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
