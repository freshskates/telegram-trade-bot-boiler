import { createConversation } from "@grammyjs/conversations";
import bot from "../bot_init";
import { BotContext, BotConversation } from "../utils/util_bot";
import { partial_conversation_settings__GENERALIZED__VALUE_REGEX } from "./partial_conversation/partial_conversation_settings__GENERALIZED__VALUE_REGEX";
import {
    formatAndValidateInput_number_greater_than_or_equal_to_0,
    getCallbackData,
} from "./utils/common";
import { getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData } from "./utils/util";

// IMPORTANT: THE BELOW IS THE OLD STYLE, KEEP THIS AS REFERNCE
// async function conversation_settings_swapCoinToToken_amount_VALUE_REGEX(
//     conversation: BotConversation,
//     ctx: BotContext
// ) {
//     const [tokenAddress, callbackData] = await Promise.all([
//         getTokenAddress(ctx),
//         getCallbackData(ctx),
//     ]);

//     const tokenInformation = await getBotShared()
//         .getTokenClient()
//         .getTokenInformation(tokenAddress);

//     const {userSessionDataPropertyName, userSessionDataPropertyName_VALUE} = await getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData(
//         callbackData,
//         "cb_settings_"
//     )

//     await ctx.reply(
//         `Please enter a ${tokenInformation.ticker} amount for Buy Slot ${userSessionDataPropertyName_VALUE}:`
//     );

//     ctx = await conversation.wait();
//     const { message } = ctx;

//     const customAmount = parseFloat(message?.text || "0");

//     if (isNaN(customAmount) || customAmount <= 0) {
//         await ctx.reply(`Invalid ${tokenInformation.ticker} amount.`);
//         await settings.settings(ctx);
//         return;
//         // TODO: MAYBE RE-ENTER CONVERSATION AND ASK AGAIN?
//     }

//     (ctx.session[userSessionDataPropertyName] as number) = customAmount

//     ctx.temp.shouldEditCurrentCTXMessage = true;
//     ctx.temp.conversationMethodReturnedANewCTX = true;

//     await ctx.reply(
//         `Setting saved: Slot ${userSessionDataPropertyName_VALUE} set to ${customAmount} ${tokenInformation.ticker}.`
//     );

//     await settings.settings(ctx);

// }

async function conversation_settings_swapCoinToToken_amount_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext
) {
    const callbackData = await getCallbackData(ctx);

    const { userSessionDataPropertyName, userSessionDataPropertyName_VALUE } =
        await getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData(
            callbackData,
            "cb_settings_"
        );

    const message_ask = `Please enter an Amount for Buy Amount Position (${userSessionDataPropertyName_VALUE}):`;

    async function getMessageResultInvalid(result: string) {
        return `Invalid Amount for Buy Amount Position (${userSessionDataPropertyName_VALUE}).`;
    }

    async function getMessageDone(result: string) {
        return `Buy Amount Position (${userSessionDataPropertyName_VALUE}) set to ${result}.`;
    }

    await partial_conversation_settings__GENERALIZED__VALUE_REGEX<number>(
        conversation,
        ctx,
        message_ask,
        formatAndValidateInput_number_greater_than_or_equal_to_0,
        getMessageResultInvalid,
        getMessageDone
    );
}
bot.use(
    createConversation(
        conversation_settings_swapCoinToToken_amount_VALUE_REGEX,
        "conversation_settings_swapCoinToToken_amount_VALUE_REGEX"
    )
);

async function cb_settings_swapCoinToToken_amount_VALUE_REGEX(ctx: BotContext) {
    await ctx.conversation.enter(
        "conversation_settings_swapCoinToToken_amount_VALUE_REGEX"
    );
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_settings_swapCoinToToken_amount_VALUE_([^\s]+)/,
    cb_settings_swapCoinToToken_amount_VALUE_REGEX
);
