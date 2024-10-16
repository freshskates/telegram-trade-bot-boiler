

import "dotenv/config";
import { TronClient } from "../../clients/tron";
import getPrismaClientSingleton from "../../services/prisma_client_singleton";
import { BotContext } from "../../utils";
import { fetchTokenDetails } from "../../utils/helpers";
import { formatNumber } from "../../utils/menu_helpers/homedata";

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

    const selectedSellPercent =
        ctx.session.sellpercent || settings.sellLeftPercentX;
    const selectedSlippage = ctx.session.sellslippage || settings.slippageSell;

    if (!edit) {
        ctx.session.sellpercent = settings.sellLeftPercentX;
        ctx.session.sellslippage = settings.slippageSell;
    }

    const inlineKeyboard = [
        [
            {
                text: "Back",
                callback_data: "callback__main__back",
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
                text: "Sell X% ✏️",
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
                text: "X Slippage ✏️",
                callback_data: "sell_slippagebutton_x_cb",
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
                tokenDetails.name
            } [📉](https://dexscreener.com/tron/tz4ur8mfkfykuftmsxcda7rs3r49yy2gl6) 
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
Sell \$${
                tokenDetails.name
            } [📉](https://dexscreener.com/tron/tz4ur8mfkfykuftmsxcda7rs3r49yy2gl6) 
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
