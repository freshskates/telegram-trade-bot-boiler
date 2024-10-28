import "dotenv/config";
import { MonadClient } from "../../clients/monad";
import { UserClient } from "../../clients/userClient";
import { BotContext } from "../../utils";
import { formatNumber } from "../../utils/menu_helpers/homedata";
import bot from "../bot_init";

async function displaySwapBuyToken_(ctx: BotContext) {
    const tokenAddress = ctx.session.tokenAddressSelected;
    const userId = ctx.from?.id;  // Gets the author of the message, callback query, or other things
    
    if (!userId || !tokenAddress) {        
        return;
    }

    const tokenDetails = await MonadClient.fetchTokenMarketDetails(
        tokenAddress
    );
    const walletBalance = await MonadClient.checkMonadBalance(
        ctx.user.user.walletPb
    );

    const userSettings = await UserClient.getUserSettings(userId.toString());
    
    if (!userSettings) {
        return;
    }

    ctx.session.selectedBuySwapAmount =
        userSettings.selectedBuy <= 0 ? userSettings.buyTopLeftX : userSettings.selectedBuy;

    ctx.session.selectedBuySwapSlippage =
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
                callback_data: "cb_swapBuyToken_refresh",

            },
        ],
        [
            {
                text: `${
                    ctx.session.selectedBuySwapAmount === userSettings.buyTopLeftX ? "✅ " : ""
                }Buy ${userSettings.buyTopLeftX} MON`,
                callback_data: "cb_swapBuyToken_tl",
            },
            {
                text: `${
                    ctx.session.selectedBuySwapAmount === userSettings.buyTopCenterX
                        ? "✅ "
                        : ""
                }Buy ${userSettings.buyTopCenterX} MON`,
                callback_data: "cb_swapBuyToken_tc",
            },
            {
                text: `${
                    ctx.session.selectedBuySwapAmount === userSettings.buyTopRightX ? "✅ " : ""
                }Buy ${userSettings.buyTopRightX} MON`,
                callback_data: "cb_swapBuyToken_tr",
            },
        ],
        [
            {
                text: `${
                    ctx.session.selectedBuySwapAmount === userSettings.buyBottomLeftX
                        ? "✅ "
                        : ""
                }Buy ${userSettings.buyBottomLeftX} MON`,
                callback_data: "cb_swapBuyToken_bl",
            },
            {
                text: `${
                    ctx.session.selectedBuySwapAmount === userSettings.buyBottomRightX
                        ? "✅ "
                        : ""
                }Buy ${userSettings.buyBottomRightX} MON`,
                callback_data: "cb_swapBuyToken_br",
            },
            {
                text: `${
                    ctx.session.selectedBuySwapAmount === userSettings.buyCustomX ? "✅ " : ""
                }Buy ${
                    userSettings.buyCustomX <= 0 ? "X" : userSettings.buyCustomX
                } MON ✏️`,
                callback_data: "cb_swapBuyToken_x",
            },
        ],
        [
            {
                text: `${
                    ctx.session.selectedBuySwapSlippage === userSettings.slippageBuy
                        ? "✅ "
                        : ""
                }${userSettings.slippageBuy}% Slippage`,
                callback_data: "cb_swapBuyToken_slippage",
            },
            {
                text: `${
                    ctx.session.selectedBuySwapSlippage === userSettings.slippageBuyCustom
                        ? "✅ "
                        : ""
                }${
                    userSettings.slippageBuyCustom <= 0
                        ? "X%"
                        : userSettings.slippageBuyCustom
                }% Slippage ✏️`,
                callback_data: "cb_swapBuyToken_slippage_x",
            },
        ],
        [
            {
                text: "Swap",
                callback_data: "cb_swapBuyToken_swap",
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
    if (!ctx.temp.swapBuyTokenUpdated) {
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


const displaySwapBuyToken = {
    displaySwapBuyToken: displaySwapBuyToken_,
};

export { displaySwapBuyToken };

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

bot.callbackQuery("cb_root_swapBuyToken", cb_buy);

// TODO: CHANGE THIS FROM REGEX TO A CONVERSATION
async function load_token(ctx: BotContext) {
    if (!ctx?.message?.text) return;

    const token = ctx?.message.text?.trim();
    ctx.session.tokenAddressSelected = token;

    console.log("Printing ctx.temp");
    console.log(ctx.temp);
    console.log("Printing ctx.");
    console.log(ctx);

    return await displaySwapBuyToken_(ctx);
}

bot.hears(/^T[a-zA-Z0-9]{33}$/, load_token);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
