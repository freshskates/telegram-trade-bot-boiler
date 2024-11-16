import { createConversation } from "@grammyjs/conversations";
import { CallbackQueryContext } from "grammy";
import bot from "../../bot_init";
import getBotShared from "../../defined/BotShared";
import { BotContext, BotConversation } from "../../utils/bot_utility";

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
    // const id = ctx.update.callback_query?.from.id;

    // // FIXME: HJOSEOPH
    // if (!id) {
    //     return;
    // }

    // const userSettings = await PRISMA_CLIENT.settings.findUnique({
    //     where: {
    //         userId: id.toString(),
    //     },
    // });

    // if (!userSettings) {
    //     await ctx.reply("No settings found for your account.");
    //     return;
    // }

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
                    [{ text: "-- Gas Fees (Buy) --", callback_data: "empty" }],
                    [
                        {
                            text: `Economy 🐴 ${ctx_session_cached.swapCoinToToken_gas_fee_1}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_gas_fee_LOCATION_0_0",
                        },
                        {
                            text: `Normal 🚀 ${ctx_session_cached.swapCoinToToken_gas_fee_2}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_gas_fee_LOCATION_0_1",
                        },
                        {
                            text: `Ultra 🦄 ${ctx_session_cached.swapCoinToToken_gas_fee_3}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_gas_fee_LOCATION_0_2",
                        },
                    ],
                    [
                        {
                            text: `✏️ Custom:  ${
                                ctx_session_cached.swapCoinToToken_amount_custom
                            } ${getBotShared().getCoinInformation().ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_gas_fee_LOCATION_CUSTOM",
                        },
                    ],
                    [{ text: "-- Gas Fees (Sell) --", callback_data: "empty" }],
                    [
                        {
                            text: `Economy 🐴 ${ctx_session_cached.swapTokenToCoin_gas_fee_1}`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_gas_fee_LOCATION_0_0",
                        },
                        {
                            text: `Normal 🚀 ${ctx_session_cached.swapTokenToCoin_gas_fee_2}`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_gas_fee_LOCATION_0_1",
                        },
                        {
                            text: `Ultra 🦄 ${ctx_session_cached.swapTokenToCoin_gas_fee_3}`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_gas_fee_LOCATION_0_2",
                        },
                    ],
                    [
                        {
                            text: `✏️ Custom:  ${
                                ctx_session_cached.swapTokenToCoin_gas_fee_custom
                            } ${getBotShared().getCoinInformation().ticker}`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_gas_fee_LOCATION_CUSTOM",
                        },
                    ],
                    [{ text: "-- Buy Amounts --", callback_data: "empty" }],
                    [
                        {
                            text: `✏️ ${
                                ctx_session_cached.swapCoinToToken_amount_1
                            } ${getBotShared().getCoinInformation().ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_LOCATION_0_0",
                        },
                        {
                            text: `✏️ ${
                                ctx_session_cached.swapCoinToToken_amount_2
                            } ${getBotShared().getCoinInformation().ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_LOCATION_0_1",
                        },
                        {
                            text: `✏️ ${
                                ctx_session_cached.swapCoinToToken_amount_3
                            } ${getBotShared().getCoinInformation().ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_LOCATION_0_2",
                        },
                    ],
                    [
                        {
                            text: `✏️ ${
                                ctx_session_cached.swapCoinToToken_amount_4
                            } ${getBotShared().getCoinInformation().ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_LOCATION_1_0",
                        },
                        {
                            text: `✏️ ${
                                ctx_session_cached.swapCoinToToken_amount_5
                            } ${getBotShared().getCoinInformation().ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_amount_LOCATION_1_1",
                        },
                    ],
                    [
                        {
                            text: `✏️ Buy Slippage: ${ctx_session_cached.swapCoinToToken_slippage_selected}%`,
                            callback_data:
                                "cb_settings_swapCoinToToken_slippage_LOCATION_0_0",
                        },
                    ],
                    [{ text: "-- Sell Amounts --", callback_data: "empty" }],
                    [
                        {
                            text: `✏️ ${ctx_session_cached.swapTokenToCoin_amount_percent_1}%`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_amount_precent_LOCATION_0_0",
                        },
                        {
                            text: `✏️ ${ctx_session_cached.swapTokenToCoin_amount_percent_2}%`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_amount_precent_LOCATION_0_1",
                        },
                    ],
                    [
                        {
                            text: `✏️ Sell Slippage: ${ctx_session_cached.swapTokenToCoin_slippage_selected}%`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_slippage_LOCATION_0_0",
                        },
                    ],
                    [{ text: "Home", callback_data: "cb_root_home" }],
                ],
            },
        }
    );
}

async function cb_settings(ctx: BotContext) {
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
