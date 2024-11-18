import bot from "../bot_init";
import getBotShared from "../defined/BotShared";
import { BotContext, BotConversation } from "../utils/util_bot";
import {
    getCallbackData,
    getGrammyUser,
    getTokenAddress,
    getUserSettings,
} from "./utils/common";
import {
    FormatAndValidateInput,
    GetMessageResultInvalid,
    GetMessageDone,
} from "./utils/types";
import { getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData } from "./utils/util";

async function conversation_settings__GENERALIZED__VALUE_REGEX<T>(
    conversation: BotConversation,
    ctx: BotContext,
    message_ask: string,
    formatAndValidateInput: FormatAndValidateInput<T>,
    getMessageResultInvalid: GetMessageResultInvalid,
    getMessageDone: GetMessageDone
) {
    const [callbackData] = await Promise.all([getCallbackData(ctx)]);

    const { userSessionDataPropertyName, userSessionDataPropertyName_VALUE } =
        await getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData(
            callbackData,
            "cb_settings_"
        );

    // Ask user for input
    await ctx.reply(message_ask);

    ctx = await conversation.wait();
    const { message } = ctx; // Get user's message from their response

    // Format and Validate user's input
    const {
        resultFormattedValidated: resultFormattedValidated,
        isResultValid: isResultValid,
    } = await formatAndValidateInput(message?.text);

    // Invalid message from user
    if (!isResultValid) {
        await ctx.reply(
            await getMessageResultInvalid(`${resultFormattedValidated}`)
        );
        await settings.settings(ctx);
        return;
        // TODO: MAYBE RE-ENTER CONVERSATION AND ASK AGAIN?
    }
    
    console.log("FUCK", );
    console.log(ctx.session[userSessionDataPropertyName], resultFormattedValidated);
    

    // Assign user's result to the corresponding session property
    (ctx.session[userSessionDataPropertyName] as T | null) =
        resultFormattedValidated;

    ctx.temp.shouldEditCurrentCTXMessage = true;
    ctx.temp.conversationMethodReturnedANewCTX = true;

    await ctx.reply(await getMessageDone(`${resultFormattedValidated}`));

    await settings.settings(ctx);
}

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
                    [
                        {
                            text: `-- Gas Fees (Buy) (${coinInformation.ticker}) --`,
                            callback_data: "empty",
                        },
                    ],
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
                            text: `✏️ Custom:  ${ctx_session_cached.swapCoinToToken_gas_fee_custom} ${coinInformation.ticker}`,
                            callback_data:
                                "cb_settings_swapCoinToToken_gas_fee_VALUE_custom",
                        },
                    ],
                    [
                        {
                            text: `-- Gas Fees (Sell) (${coinInformation.ticker}) --`,
                            callback_data: "empty",
                        },
                    ],
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
                            text: `✏️ Buy Slippage: ${ctx_session_cached.swapCoinToToken_slippage_1}%`,
                            callback_data:
                                "cb_settings_swapCoinToToken_slippage_VALUE_1",
                        },
                    ],
                    [{ text: "-- Sell Percentage --", callback_data: "empty" }],
                    [
                        {
                            text: `✏️ ${ctx_session_cached.swapTokenToCoin_amount_percent_1}%`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_amount_percent_VALUE_1",
                        },
                        {
                            text: `✏️ ${ctx_session_cached.swapTokenToCoin_amount_percent_2}%`,
                            callback_data:
                                "cb_settings_swapTokenToCoin_amount_percent_VALUE_2",
                        },
                    ],
                    [
                        {
                            text: `✏️ Sell Slippage: ${ctx_session_cached.swapTokenToCoin_slippage_1}%`,
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
    conversation_settings__GENERALIZED__VALUE_REGEX:
        conversation_settings__GENERALIZED__VALUE_REGEX,
};
export default settings;
