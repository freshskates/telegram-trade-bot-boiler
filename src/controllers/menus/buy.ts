import { CallbackQueryContext } from "grammy";


import "dotenv/config";
import { TronClient } from "../../clients/tron";
import { BotContext } from "../../utils";
import { fetchTokenDetails } from "../../utils/helpers";
import { formatNumber } from "../../utils/menu_helpers/homedata";
import getPrismaClientSingleton from "../../services/prisma_client_singleton";

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
                callback_data: "callback__main__back",
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
                callback_data: "swap_buybutton_tl_cb",
            },
            {
                text: `${
                    selectedBuyAmount === settings.buyTopCenterX ? "✅ " : ""
                }Buy ${settings.buyTopCenterX} TRX`,
                callback_data: "swap_buybutton_tc_cb",
            },
            {
                text: `${
                    selectedBuyAmount === settings.buyTopRightX ? "✅ " : ""
                }Buy ${settings.buyTopRightX} TRX`,
                callback_data: "swap_buybutton_tr_cb",
            },
        ],
        [
            {
                text: `${
                    selectedBuyAmount === settings.buyBottomLeftX ? "✅ " : ""
                }Buy ${settings.buyBottomLeftX} TRX`,
                callback_data: "swap_buybutton_bl_cb",
            },
            {
                text: `${
                    selectedBuyAmount === settings.buyBottomRightX ? "✅ " : ""
                }Buy ${settings.buyBottomRightX} TRX`,
                callback_data: "swap_buybutton_br_cb",
            },
            {
                text: "Buy X TRX ✏️",
                callback_data: "swap_buybutton_x_cb",
            },
        ],
        [
            {
                text: `${
                    selectedSlippage === settings.slippageBuy ? "✅ " : ""
                } ${settings.slippageBuy}% Slippage`,
                callback_data: "buy_slippagebutton_cb",
            },
            {
                text: "X Slippage ✏️",
                callback_data: "buy_slippagebutton_x_cb",
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

export const prompt = async (ctx: CallbackQueryContext<BotContext>) => {
    return await ctx.reply("Enter a valid TRX-20 token address: ");
};
