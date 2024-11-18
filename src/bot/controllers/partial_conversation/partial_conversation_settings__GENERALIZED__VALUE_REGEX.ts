import { BotContext, BotConversation } from "../../utils/util_bot";
import settings from "../settings";
import { getCallbackData } from "../utils/common";
import {
    FormatAndValidateInput,
    GetMessageDone,
    GetMessageResultInvalid,
} from "../utils/types";
import { getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData } from "../utils/util";

export async function partial_conversation_settings__GENERALIZED__VALUE_REGEX<T>(
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

    // Assign user's result to the corresponding session property
    (ctx.session[userSessionDataPropertyName] as T | null) =
        resultFormattedValidated;

    ctx.temp.shouldEditCurrentCTXMessage = true;
    ctx.temp.conversationMethodReturnedANewCTX = true;

    await ctx.reply(await getMessageDone(`${resultFormattedValidated}`));

    // TODO: THIS SHOULD BE MOVED
    await settings.settings(ctx);
}
