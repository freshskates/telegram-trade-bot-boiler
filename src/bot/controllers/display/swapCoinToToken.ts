import "dotenv/config";
import bot from "../../bot_init";
import getBotShared from "../../defined/BotShared";
import {
    NoAuthorError,
    NoTokenAddressError,
    UserSettingsDoesNotExistError,
} from "../../utils/error";
import { BotContext } from "../../utils/util_bot";
import {
    getGrammyUser,
    getTokenAddress,
    getTokenHeaderFormatted,
    getUserSettings,
} from "../utils/common";

async function get_swapCoinToToken_HeaderFormatted(
    ctx: BotContext,
    tokenAddress: string
): Promise<string> {
    return getTokenHeaderFormatted(ctx, tokenAddress, "Buy");
}

async function swapCoinToToken_(ctx: BotContext) {

    const [tokenAddress, grammyUser] = await Promise.all([
        getTokenAddress(ctx),
        getGrammyUser(ctx),
    ]);

    const grammyUserId = grammyUser.id;

    const userSettings = await getUserSettings(grammyUserId);

    const tokenInformation = await getBotShared()
        .getTokenClient()
        .getTokenInformation(tokenAddress);

    // This should reduce read/writes
    let ctx_session_cached = ctx.session;

    ctx.session.swapCoinToToken_amount_selected =
        ctx_session_cached.swapCoinToToken_amount_selected <= 0
            ? ctx_session_cached.swapCoinToToken_amount_1
            : ctx_session_cached.swapCoinToToken_amount_selected;

    ctx.session.swapCoinToToken_slippage_selected =
        ctx_session_cached.swapCoinToToken_slippage_selected <= 0
            ? ctx_session_cached.swapCoinToToken_slippage_1
            : ctx_session_cached.swapCoinToToken_slippage_selected;

    // Update the cache // This should reduce read/writes
    ctx_session_cached = ctx.session;

    const inlineKeyboard = [
        [
            {
                text: "Home",
                callback_data: "cb_root_home",
            },
            {
                text: "Refresh",
                callback_data: "cb_swapCoinToToken_refresh",
            },
        ],
        [
            {
                text: `${
                    ctx_session_cached.swapCoinToToken_amount_selected ===
                    ctx_session_cached.swapCoinToToken_amount_1
                        ? "✅ "
                        : ""
                }Buy ${ctx_session_cached.swapCoinToToken_amount_1} ${
                    tokenInformation.ticker
                }`,
                callback_data: "cb_swapCoinToToken_amount_VALUE_1",
            },
            {
                text: `${
                    ctx_session_cached.swapCoinToToken_amount_selected ===
                    ctx_session_cached.swapCoinToToken_amount_2
                        ? "✅ "
                        : ""
                }Buy ${ctx_session_cached.swapCoinToToken_amount_2} ${
                    tokenInformation.ticker
                }`,
                callback_data: "cb_swapCoinToToken_amount_VALUE_2",
            },
            {
                text: `${
                    ctx_session_cached.swapCoinToToken_amount_selected ===
                    ctx_session_cached.swapCoinToToken_amount_3
                        ? "✅ "
                        : ""
                }Buy ${ctx_session_cached.swapCoinToToken_amount_3} ${
                    tokenInformation.ticker
                }`,
                callback_data: "cb_swapCoinToToken_amount_VALUE_3",
            },
        ],
        [
            {
                text: `${
                    ctx_session_cached.swapCoinToToken_amount_selected ===
                    ctx_session_cached.swapCoinToToken_amount_4
                        ? "✅ "
                        : ""
                }Buy ${ctx_session_cached.swapCoinToToken_amount_4} ${
                    tokenInformation.ticker
                }`,
                callback_data: "cb_swapCoinToToken_amount_VALUE_4",
            },
            {
                text: `${
                    ctx_session_cached.swapCoinToToken_amount_selected ===
                    ctx_session_cached.swapCoinToToken_amount_5
                        ? "✅ "
                        : ""
                }Buy ${ctx_session_cached.swapCoinToToken_amount_5} ${
                    tokenInformation.ticker
                }`,
                callback_data: "cb_swapCoinToToken_amount_VALUE_5",
            },
            {
                text: `${
                    ctx_session_cached.swapCoinToToken_amount_selected ===
                    ctx_session_cached.swapCoinToToken_amount_custom
                        ? "✅ "
                        : ""
                }✏️ Buy ${
                    ctx_session_cached.swapCoinToToken_amount_custom <= 0
                        ? "(CUSTOM)"
                        : ctx_session_cached.swapCoinToToken_amount_custom
                } ${tokenInformation.ticker}`,
                callback_data: "cb_swapCoinToToken_amount_VALUE_custom",
            },
        ],
        [
            {
                text: `${
                    ctx_session_cached.swapCoinToToken_slippage_selected ===
                    ctx_session_cached.swapCoinToToken_slippage_1
                        ? "✅ "
                        : ""
                }${ctx_session_cached.swapCoinToToken_slippage_1}% Slippage`,
                callback_data: "cb_swapCoinToToken_slippage_VALUE_1",
            },
            {
                text: `${
                    ctx_session_cached.swapCoinToToken_slippage_selected ===
                    ctx_session_cached.swapCoinToToken_slippage_custom
                        ? "✅ "
                        : ""
                }✏️ ${
                    ctx_session_cached.swapCoinToToken_slippage_custom <= 0
                        ? "(CUSTOM)"
                        : ctx_session_cached.swapCoinToToken_slippage_custom
                }% Slippage`,
                callback_data: "cb_swapCoinToToken_slippage_VALUE_custom",
            },
        ],
        [
            {
                text: "Swap",
                callback_data: "cb_swapCoinToToken_swap",
            },
        ],
    ];

    const headerText = await get_swapCoinToToken_HeaderFormatted(
        ctx,
        tokenAddress
    );

    // This condition will catch false, null, and undefined
    if (
        !ctx.temp.shouldEditCurrentCTXMessage ||
        ctx.temp.conversationMethodReturnedANewCTX
    ) {
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

async function cb_swapCoinToToken_refresh(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any exist conversation to prevent buggy behavior
    await ctx.deleteMessage(); // Delete the most recent message relative to where this method was called
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await swapCoinToToken_(ctx);
    await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_swapCoinToToken_refresh", cb_swapCoinToToken_refresh);

// FIXME: The Type CallbackQueryContext<BotContext> IS THAT CORRECT? IDK
async function cb_swapCoinToToken(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior

    await ctx.reply(
        "Enter a valid Monad token address:\n(temp example: TUFonyWZ4Tza5MzgDj6g2u5rfdGoRVYG7g)"
    );
    await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_swapCoinToToken", cb_swapCoinToToken);

async function hears_load_token_REGEX(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any exist conversation to prevent buggy behavior

    if (!ctx?.message?.text) return;

    const tokenAddress = ctx?.message.text?.trim();
    ctx.session.tokenAddress_selected = tokenAddress;

    await swapCoinToToken_(ctx);
}

bot.hears(/^T[a-zA-Z0-9]{33}$/, hears_load_token_REGEX);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded

/* 
**************************************************
Exporting
**************************************************
*/

const swapCoinToToken = {
    swapCoinToToken: swapCoinToToken_,
};

export { swapCoinToToken };
