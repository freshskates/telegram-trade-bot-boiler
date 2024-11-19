import getBotShared from "../../defined/BotShared";
import { BotContext, BotConversation } from "../../utils/util_bot";
import {
    formatAndValidateInput_number_greater_than_or_equal_to_0
} from "../utils/common";
import {
    FormatAndValidateInput,
    GetMessageDone,
    GetMessageResultInvalid,
} from "../utils/types";
import { UserSessionPropertyName_Data } from "../utils/util";

export interface PartialConversationCTXData {
    ctx: BotContext;
    isResultValid: boolean;
}

/**
 * Asks user for input and automatically assigns that input value to the correct ctx.session property.
 *
 * Notes:
 *      1. Asks users for input
 *      2. Format and Validate input
 *          2a. Continue if Valid input
 *          2b. Fail to assign, return PartialConversationCTXData
 *      3. Assign Valid/formatted input to ctx.session
 *      4. return PartialConversationCTXData
 *
 * @export
 * @async
 * @template T
 * @param {BotConversation} conversation
 * @param {BotContext} ctx
 * @param {UserSessionPropertyName_Data} userSessionDataProperty_data
 * @param {string} message_ask
 * @param {FormatAndValidateInput<T>} formatAndValidateInput
 * @param {GetMessageResultInvalid} getMessageResultInvalid
 * @param {GetMessageDone} getMessageDone
 * @returns {Promise<PartialConversationCTXData>}
 */
export async function partial_conversation__GENERALIZED__VALUE_REGEX<T>(
    conversation: BotConversation,
    ctx: BotContext,
    userSessionDataProperty_data: UserSessionPropertyName_Data,
    message_ask: string,
    formatAndValidateInput: FormatAndValidateInput<T>,
    getMessageResultInvalid: GetMessageResultInvalid,
    getMessageDone: GetMessageDone
): Promise<PartialConversationCTXData> {
    // Ask user for input
    await ctx.reply(message_ask);

    ctx = await conversation.wait();
    const { message } = ctx; // Get user's message from their response

    // Format and Validate user's input
    const {
        resultFormattedValidated: resultFormattedValidated,
        isResultValid: isResultValid,
    } = await formatAndValidateInput(
        message?.text,
        `${
            ctx.session[
                userSessionDataProperty_data.userSessionDataPropertyName
            ]
        }`
    );

    // Invalid message from user
    if (!isResultValid) {
        await ctx.reply(
            await getMessageResultInvalid(`${resultFormattedValidated}`)
        );
        return { ctx, isResultValid };

        // TODO: MAYBE RE-ENTER CONVERSATION AND ASK AGAIN?
    }

    // Assign user's result to the corresponding session property
    (ctx.session[
        userSessionDataProperty_data.userSessionDataPropertyName
    ] as T | null) = resultFormattedValidated;

    ctx.temp.shouldEditCurrentCTXMessage = true;
    ctx.temp.conversationMethodReturnedANewCTX = true;

    await ctx.reply(await getMessageDone(`${resultFormattedValidated}`));

    return { ctx, isResultValid };
}

export async function partial_conversation_swapCoinToToken_amount_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext,
    userSessionDataProperty_data: UserSessionPropertyName_Data
): Promise<PartialConversationCTXData> {
    const message_ask = `Please enter an Amount for Buy Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}):`;

    async function getMessageResultInvalid(result: string) {
        return `Invalid Amount for Buy Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}).`;
    }

    async function getMessageDone(result: string) {
        return `Buy Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}) set to ${result}.`;
    }

    return await partial_conversation__GENERALIZED__VALUE_REGEX<number>(
        conversation,
        ctx,
        userSessionDataProperty_data,
        message_ask,
        formatAndValidateInput_number_greater_than_or_equal_to_0,
        getMessageResultInvalid,
        getMessageDone
    );
}
export async function partial_conversation_swapCoinToToken_gas_fee_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext,
    userSessionDataProperty_data: UserSessionPropertyName_Data
): Promise<PartialConversationCTXData> {
    const coinInformation = await getBotShared().getCoinInformation();

    const message_ask = `Please enter a Gas Fee Amount in ${coinInformation.ticker} for Buy Gas Fee Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}):`;

    async function getMessageResultInvalid(result: string) {
        return `Invalid Gas Fee Amount for Buy Gas Fee Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}).`;
    }

    async function getMessageDone(result: string) {
        return `Buy Gas Fee Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}) set to ${result}.`;
    }

    return await partial_conversation__GENERALIZED__VALUE_REGEX<number>(
        conversation,
        ctx,
        userSessionDataProperty_data,
        message_ask,
        formatAndValidateInput_number_greater_than_or_equal_to_0,
        getMessageResultInvalid,
        getMessageDone
    );
}

export async function partial_conversation_swapCoinToToken_slippage_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext,
    userSessionDataProperty_data: UserSessionPropertyName_Data
): Promise<PartialConversationCTXData> {
    const message_ask = `Please enter a Slippage Percentage for Buy Slippage Percentage Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}):`;

    async function getMessageResultInvalid(result: string) {
        return `Invalid Slippage Percentage for Buy Slippage Percentage Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}).`;
    }

    async function getMessageDone(result: string) {
        return `Buy Slippage Percentage Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}) set to ${result}.`;
    }

    return await partial_conversation__GENERALIZED__VALUE_REGEX<number>(
        conversation,
        ctx,
        userSessionDataProperty_data,
        message_ask,
        formatAndValidateInput_number_greater_than_or_equal_to_0,
        getMessageResultInvalid,
        getMessageDone
    );
}
export async function partial_conversation_swapTokenToCoin_amount_percent_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext,
    userSessionDataProperty_data: UserSessionPropertyName_Data
): Promise<PartialConversationCTXData> {
    const message_ask = `Please enter a Percentage Amount for Sell Percentage Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}):`;

    async function getMessageResultInvalid(result: string) {
        return `Invalid Percentage Amount for Sell Percentage Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}).`;
    }

    async function getMessageDone(result: string) {
        return `Sell Percentage Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}) set to ${result}.`;
    }

    return await partial_conversation__GENERALIZED__VALUE_REGEX<number>(
        conversation,
        ctx,
        userSessionDataProperty_data,
        message_ask,
        formatAndValidateInput_number_greater_than_or_equal_to_0,
        getMessageResultInvalid,
        getMessageDone
    );
}
export async function partial_conversation_swapTokenToCoin_gas_fee_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext,
    userSessionDataProperty_data: UserSessionPropertyName_Data
): Promise<PartialConversationCTXData> {
    const coinInformation = await getBotShared().getCoinInformation();

    const message_ask = `Please enter a Gas Fee Amount in ${coinInformation.ticker} for Sell Gas Fee Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}):`;

    async function getMessageResultInvalid(result: string) {
        return `Invalid Gas Fee Amount for Sell Gas Fee Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}).`;
    }

    async function getMessageDone(result: string) {
        return `Sell Gas Fee Amount Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}) set to ${result}.`;
    }

    return await partial_conversation__GENERALIZED__VALUE_REGEX<number>(
        conversation,
        ctx,
        userSessionDataProperty_data,
        message_ask,
        formatAndValidateInput_number_greater_than_or_equal_to_0,
        getMessageResultInvalid,
        getMessageDone
    );
}
export async function partial_conversation_swapTokenToCoin_slippage_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext,
    userSessionDataProperty_data: UserSessionPropertyName_Data
): Promise<PartialConversationCTXData> {
    const message_ask = `Please enter a Slippage Percentage for Sell Slippage Percentage Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}):`;

    async function getMessageResultInvalid(result: string) {
        return `Invalid Slippage Percentage for Sell Slippage Percentage Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}).`;
    }

    async function getMessageDone(result: string) {
        return `Sell Slippage Percentage Position (${userSessionDataProperty_data.userSessionDataPropertyName_VALUE}) set to ${result}.`;
    }

    return await partial_conversation__GENERALIZED__VALUE_REGEX<number>(
        conversation,
        ctx,
        userSessionDataProperty_data,
        message_ask,
        formatAndValidateInput_number_greater_than_or_equal_to_0,
        getMessageResultInvalid,
        getMessageDone
    );
}
