import "dotenv/config";
import bot from "../../bot_init";
import { BotContext } from "../../utils/bot_utility";
import { getTokenHeaderFormatted } from "../utils/common";

async function get_swapTokenToCoin_HeaderFormatted(
    ctx: BotContext,
    tokenAddress: string
): Promise<string> {
    return getTokenHeaderFormatted(ctx, tokenAddress, "Sell");
}

async function swapTokenToCoin_(ctx: BotContext) {
    const tokenAddress = ctx.session.tokenAddress_selected;
    const userId = ctx.from?.id;

    // TODO: FIX THIS SHIT
    if (!userId || !tokenAddress) {
        return;
    }

    // const tokenDetails = await getBotShared()
    //     .getCoinClient()
    //     .getTokenMarketDetails(tokenAddress);
    // const walletBalance = await getBotShared()
    //     .getCoinClient()
    //     .getCoinWalletBalance(ctx.user.user.walletPublicKey);

    // const settings = await BotShared.getDatabaseClientHandler().getUserSettings(userId.toString());

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
    ctx_session_cached = ctx.session;

    const inlineKeyboard = [
        [
            {
                text: "Home",
                callback_data: "cb_root_home",
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
                callback_data: "cb_swapTokenToCoin_amount_percent_LOCATION_0_0",
            },
            {
                text: `${
                    ctx_session_cached.swapTokenToCoin_amount_percent_selected ===
                    ctx_session_cached.swapTokenToCoin_amount_percent_2
                        ? "✅ "
                        : ""
                }Sell ${ctx_session_cached.swapTokenToCoin_amount_percent_2}%`,
                callback_data: "cb_swapTokenToCoin_amount_percent_LOCATION_0_1",
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
                        ? "(CUSTOM)"
                        : ctx_session_cached.swapTokenToCoin_amount_percent_custom
                }% ✏️`,
                callback_data:
                    "cb_swapTokenToCoin_amount_percent_LOCATION_CUSTOM",
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
                callback_data: "cb_swapTokenToCoin_slippage_LOCATION_0_0",
            },
            {
                text: `${
                    ctx_session_cached.swapTokenToCoin_slippage_selected ===
                    ctx_session_cached.swapTokenToCoin_slippage_custom
                        ? "✅ "
                        : ""
                }${
                    ctx_session_cached.swapTokenToCoin_slippage_custom <= 0
                        ? "(CUSTOM)"
                        : ctx_session_cached.swapTokenToCoin_slippage_custom
                }% Slippage ✏️`,
                callback_data: "cb_swapTokenToCoin_slippage_LOCATION_CUSTOM",
            },
        ],
        [
            {
                text: "Swap",
                callback_data: "swap_sell_cb",
            },
        ],
    ];

    if (
        !ctx.temp.shouldEditCurrentCTXMessage ||
        ctx.temp.conversationMethodReturnedANewCTX
    ) {
        await ctx.reply(
            await get_swapTokenToCoin_HeaderFormatted(ctx, tokenAddress),
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: inlineKeyboard,
                },
            }
        );
    } else {
        await ctx.editMessageText(
            await get_swapTokenToCoin_HeaderFormatted(ctx, tokenAddress),
            {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: inlineKeyboard,
                },
            }
        );
    }
}

async function cb_swapTokenToCoin_ADDRESS_REGEX(ctx: BotContext) {
    if (ctx.match == null) {
        return;
    }

    const tokenAddress = ctx.match[1];
    console.log(`Token Address: ${tokenAddress}`);

    ctx.session.tokenAddress_selected = tokenAddress;

    await swapTokenToCoin_(ctx);
}

bot.callbackQuery(/cb_sTTC_ADDRESS_(.+)/, cb_swapTokenToCoin_ADDRESS_REGEX);

/* 
**************************************************
Exporting
**************************************************
*/

const swapTokenToCoin = {
    swapTokenToCoin: swapTokenToCoin_,
};
export { swapTokenToCoin };

