import { createConversation } from "@grammyjs/conversations";
import { CallbackQueryContext } from "grammy";
import bot from "../../bot_init";
import getBotShared from "../../defined/BotShared";
import { BotContext, BotConversation } from "../../utils/util_bot";
import {
    getCallbackData,
    getGrammyUser,
    getTokenAddress,
    getUserSettings,
} from "../utils/common";

async function cb_buybutton(ctx: CallbackQueryContext<BotContext>) {
    await ctx.conversation.exit();
    await ctx.conversation.reenter("conversation_buyButton");
    await ctx.answerCallbackQuery();
}
// WARNING: NOT FUCKING USED
bot.callbackQuery("cb_buybutton", cb_buybutton); // TODO: "cb_buybutton" is never called

async function conversation_buyButton(
    conversation: BotConversation,
    ctx: BotContext
) {
    const id = ctx.update.callback_query?.from.id;

    // const user =
    console.log("FUCK");
}
// WARNING: NOT FUCKING USED
bot.use(
    createConversation(
        conversation_buyButton,
        "conversation_buyprompt" // TODO: "conversation_buyprompt" is never used
    )
);
bot.use(createConversation(conversation_buyButton, "conversation_buyButton"));

async function settings_(ctx: BotContext) {
    const [tokenAddress, grammyUser] = await Promise.all([
        getTokenAddress(ctx),
        getGrammyUser(ctx),
    ]);

    // const userId = ctx.update.callback_query?.from.id;
    const grammyUserId = grammyUser.id;

    const tokenInformation = await getBotShared()
        .getTokenClient()
        .getTokenInformation(tokenAddress);

    const coinInformation = await getBotShared().getCoinInformation();

    const userSettings = await getUserSettings(grammyUserId);

    const ctx_session_cached = ctx.session;

    await ctx.reply(
        `
💰Fee Discount: You are receiving a 10% discount on trading fees for being a referral of another user.
    `,
        {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Back",
                            callback_data: "cb_root_home",
                        },
                        {
                            text: "Advanced",
                            callback_data: "cb_settings_advanced",
                        },
                    ],
                    [{ text: `-- Gas Fees (Buy) (${coinInformation.ticker}) --`, callback_data: "empty" }],
                    [
                        {
                            text: `Economy 🐴 ${ctx_session_cached.swapCoinToToken_gas_fee_1} ${coinInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_gas_fee_VALUE_1",
                        },
                        {
                            text: `Normal 🚀 ${ctx_session_cached.swapCoinToToken_gas_fee_2} ${coinInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_gas_fee_VALUE_2",
                        },
                        {
                            text: `Ultra 🦄 ${ctx_session_cached.swapCoinToToken_gas_fee_3} ${coinInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_gas_fee_VALUE_3",
                        },
                    ],
                    [
                        {
                            text: `✏️ Custom:  ${ctx_session_cached.swapCoinToToken_amount_custom} ${coinInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_gas_fee_VALUE_custom",
                        },
                    ],
                    [{ text: `-- Gas Fees (Sell) (${coinInformation.ticker}) --`, callback_data: "empty" }],
                    [
                        {
                            text: `Economy 🐴 ${ctx_session_cached.swapTokenToCoin_gas_fee_1} ${coinInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_gas_fee_VALUE_1",
                        },
                        {
                            text: `Normal 🚀 ${ctx_session_cached.swapTokenToCoin_gas_fee_2} ${coinInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_gas_fee_VALUE_2",
                        },
                        {
                            text: `Ultra 🦄 ${ctx_session_cached.swapTokenToCoin_gas_fee_3} ${coinInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_gas_fee_VALUE_3",
                        },
                    ],
                    [
                        {
                            text: `✏️ Custom:  ${ctx_session_cached.swapTokenToCoin_gas_fee_custom} ${coinInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_gas_fee_VALUE_custom",
                        },
                    ],
                    [{ text: "-- Buy Amounts --", callback_data: "empty" }],
                    [
                        {
                            text: `✏️ ${ctx_session_cached.swapCoinToToken_amount_1} ${tokenInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_VALUE_1",
                        },
                        {
                            text: `✏️ ${ctx_session_cached.swapCoinToToken_amount_2} ${tokenInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_VALUE_2",
                        },
                        {
                            text: `✏️ ${ctx_session_cached.swapCoinToToken_amount_3} ${tokenInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_VALUE_3",
                        },
                    ],
                    [
                        {
                            text: `✏️ ${ctx_session_cached.swapCoinToToken_amount_4} ${tokenInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_VALUE_4",
                        },
                        {
                            text: `✏️ ${ctx_session_cached.swapCoinToToken_amount_5} ${tokenInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_VALUE_5",
                        },
                    ],
                    [
                        {
                            text: `✏️ Buy Slippage: ${ctx_session_cached.swapCoinToToken_slippage_selected}%`,
                            callback_data:
                                "cb_settings_swapCoinToToken_slippage_VALUE_1",
                        },
                    ],
                    [{ text: "-- Sell Percentage --", callback_data: "empty" }],
                    [
                        {
                            text: `✏️ ${ctx_session_cached.swapTokenToCoin_amount_percent_1}%`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_amount_precent_VALUE_1",
                        },
                        {
                            text: `✏️ ${ctx_session_cached.swapTokenToCoin_amount_percent_2}%`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_amount_precent_VALUE_2",
                        },
                    ],
                    [
                        {
                            text: `✏️ Sell Slippage: ${ctx_session_cached.swapTokenToCoin_slippage_selected}%`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_slippage_VALUE_1",
                        },
                    ],
                    [{ text: "Home", callback_data: "cb_root_home" }],
                ],
            },
        }
    );
}

async function cb_settings(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any exist conversation to prevent buggy behavior

    await settings_(ctx);
    await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_settings", cb_settings);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded

const settings = {
    settings: settings_,
};
export default settings;
