import { createConversation } from "@grammyjs/conversations";
import { CallbackQueryContext } from "grammy";
import bot from "../../bot_init";
import getBotShared from "../../defined/BotShared";
import getDatabaseClientPrismaSingleton from "../../defined/DatabaseClientPrisma";
import { BotContext, BotConversation } from "../../utils/bot_utility";

const PRISMA_CLIENT = getDatabaseClientPrismaSingleton();

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

export async function cb_settings(ctx: BotContext) {
    const id = ctx.update.callback_query?.from.id;

    // FIXME: HJOSEOPH
    if (!id) {
        return;
    }

    const userSettings = await PRISMA_CLIENT.settings.findUnique({
        where: {
            userId: id.toString(),
        },
    });

    if (!userSettings) {
        await ctx.reply("No settings found for your account.");
        return;
    }

    const ctx_session_cached = ctx.session;

    await ctx.reply(
        `
💰Fee Discount: You are receiving a 10% discount on trading fees for being a referral of another user.
    `,
        {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "-- Gas Fees (Sell) --", callback_data: "empty" }],
                    [
                        {
                            text: `Economy 🐴 ${ctx_session_cached.swapTokenToCoin_gas_fee_1}`,
                            callback_data: "cb_set_gas_1",
                        },
                        {
                            text: `Normal 🚀 ${ctx_session_cached.swapTokenToCoin_gas_fee_2}`,
                            callback_data: "cb_set_gas_2",
                        },
                        {
                            text: `Ultra 🦄 ${ctx_session_cached.swapTokenToCoin_gas_fee_3}`,
                            callback_data: "cb_set_gas_3",
                        },
                    ],
                    [
                        {
                            text: `Custom:  ${userSettings.gasFee} ${
                                getBotShared().getCoinInformation().ticker
                            } ✏️`,
                            callback_data: "cb_set_gas_x",
                        },
                    ],
                    [{ text: "-- Buy Amounts --", callback_data: "empty" }],
                    [
                        {
                            text: `${ctx_session_cached.swapCoinToToken_amount_1} ${
                                getBotShared().getCoinInformation().ticker
                            } ✏️`,
                            callback_data: "cb_buy_button_tl",
                        },
                        {
                            text: `${ctx_session_cached.swapCoinToToken_amount_2} ${
                                getBotShared().getCoinInformation().ticker
                            } ✏️`,
                            callback_data: "cb_buy_button_tc",
                        },
                        {
                            text: `${ctx_session_cached.swapCoinToToken_amount_3} ${
                                getBotShared().getCoinInformation().ticker
                            } ✏️`,
                            callback_data: "cb_buy_button_tr",
                        },
                    ],
                    [
                        {
                            text: `${ctx_session_cached.swapCoinToToken_amount_4} ${
                                getBotShared().getCoinInformation().ticker
                            } ✏️`,
                            callback_data: "cb_buy_button_bl",
                        },
                        {
                            text: `${ctx_session_cached.swapCoinToToken_amount_5} ${
                                getBotShared().getCoinInformation().ticker
                            } ✏️`,
                            callback_data: "cb_buy_button_br",
                        },
                    ],
                    [
                        {
                            text: `Buy Slippage: ${ctx_session_cached.swapCoinToToken_slippage_selected}% ✏️`,
                            callback_data: "cb_buy_setting_slippage",
                        },
                    ],
                    [{ text: "-- Sell Amounts --", callback_data: "empty" }],
                    [
                        {
                            text: `${ctx_session_cached.swapTokenToCoin_amount_percent_1}% ✏️`,
                            callback_data: "cb_sell_percent_l",
                        },
                        {
                            text: `${ctx_session_cached.swapTokenToCoin_amount_percent_2}% ✏️`,
                            callback_data: "cb_sell_percent_r",
                        },
                    ],
                    [
                        {
                            text: `Sell Slippage: ${ctx_session_cached.swapTokenToCoin_slippage_selected}% ✏️`,
                            callback_data: "cb_sell_setting_slippage",
                        },
                    ],
                    [{ text: "Back", callback_data: "cb_root_home" }],
                ],
            },
        }
    );

    await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_root_settings", cb_settings);
// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
