import { CallbackQueryContext } from "grammy";

import "dotenv/config";
import { TronClient } from "../../clients/tron";
import { BotContext } from "../../utils";
import { fetchTokenDetails } from "../../utils/helpers";
import { formatNumber } from "../../utils/menu_helpers/homedata";
import getPrismaClientSingleton from "../../services/prisma_client_singleton";
import bot from "../bot_init";


export const start = async (ctx: BotContext, edit: boolean = false) => {
    const tokenAddress = ctx.session.selectedToken;
    const userId = ctx.from?.id;

    if (!userId || !tokenAddress) {
        return;
    }

    const tronClient = new TronClient();

    const tokenDetails = await fetchTokenDetails(tokenAddress);
    const walletBalance = await tronClient.checkBalance(
        ctx.session.user.walletPb
    );

    const prisma = getPrismaClientSingleton();
    const settings = await prisma.settings.findUnique({
        where: {
            userId: userId.toString(),
        },
    });

    if (!settings) {
        return;
    }

    const selectedBuyAmount = ctx.session.buyamount || settings.buyTopLeftX;

    const selectedSlippage = ctx.session.buyslippage || settings.slippageBuy;

    if (!edit) {
        ctx.session.buyamount = settings.buyTopLeftX;
        ctx.session.buyslippage = settings.slippageBuy;
    }

    const inlineKeyboard = [
        [
            {
                text: "Back",
                callback_data: "callback__root__back",
            },
            {
                text: "Refresh",
                callback_data: "refresh_buy_page_cb",
            },
        ],
        [
            {
                text: `${
                    selectedBuyAmount === settings.buyTopLeftX ? "✅ " : ""
                }Buy ${settings.buyTopLeftX} TRX`,
                callback_data: "cb_swap_buybutton_tl",
            },
            {
                text: `${
                    selectedBuyAmount === settings.buyTopCenterX ? "✅ " : ""
                }Buy ${settings.buyTopCenterX} TRX`,
                callback_data: "cb_swap_buybutton_tc",
            },
            {
                text: `${
                    selectedBuyAmount === settings.buyTopRightX ? "✅ " : ""
                }Buy ${settings.buyTopRightX} TRX`,
                callback_data: "cb_swap_buybutton_tr",
            },
        ],
        [
            {
                text: `${
                    selectedBuyAmount === settings.buyBottomLeftX ? "✅ " : ""
                }Buy ${settings.buyBottomLeftX} TRX`,
                callback_data: "cb_swap_buybutton_bl",
            },
            {
                text: `${
                    selectedBuyAmount === settings.buyBottomRightX ? "✅ " : ""
                }Buy ${settings.buyBottomRightX} TRX`,
                callback_data: "cb_swap_buybutton_br",
            },
            {
                text: "Buy X TRX ✏️",
                callback_data: "cb_swap_buybutton_x",
            },
        ],
        [
            {
                text: `${
                    selectedSlippage === settings.slippageBuy ? "✅ " : ""
                } ${settings.slippageBuy}% Slippage`,
                callback_data: "cb_buy_slippagebutton",
            },
            {
                text: "X Slippage ✏️",
                callback_data: "cb_buy_slippagebutton_x",
            },
        ],
        [
            {
                text: "Swap",
                callback_data: "swap_callback_buy",
            },
        ],
    ];

    if (!edit) {
        await ctx.reply(
            `
Buy \$${
                tokenDetails.name
            } [📈](https://dexscreener.com/tron/tz4ur8mfkfykuftmsxcda7rs3r49yy2gl6) 
\`${tokenAddress}\`
  
Balance: *${walletBalance} TRX* 
Price: *\$${formatNumber(tokenDetails.priceInUsd)}* — VOL: *\$${formatNumber(
                tokenDetails.volume24h
            )}* — MC: *\$${formatNumber(tokenDetails.marketCap)}*
  
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
Buy \$${
                tokenDetails.name
            } [📈](https://dexscreener.com/tron/tz4ur8mfkfykuftmsxcda7rs3r49yy2gl6) 
\`${tokenAddress}\`

Balance: *${walletBalance} TRX* 
Price: *\$${formatNumber(tokenDetails.priceInUsd)}* — VOL: *\$${formatNumber(
                tokenDetails.volume24h
            )}* — MC: *\$${formatNumber(tokenDetails.marketCap)}*

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
};


const buy = {
    start: start
}

export {buy}


/* 
**************************************************
Something about buying idk   
**************************************************
*/

bot.hears(/^T[a-zA-Z0-9]{33}$/, async (ctx: BotContext) => {
    if (!ctx?.message?.text) return;

    const token = ctx?.message.text?.trim();
    ctx.session.selectedToken = token;

    return await start(ctx);
});


export const cb__root__buy = async (ctx: CallbackQueryContext<BotContext>) => {
    return await ctx.reply("Enter a valid   TRX-20 token address: ");
};
bot.callbackQuery("cb__root__buy", cb__root__buy);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
