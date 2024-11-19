import { createConversation } from "@grammyjs/conversations";
import bot from "../bot_init";
import { BotContext, BotConversation } from "../utils/util_bot";
import { partial_conversation_swapCoinToToken_amount_VALUE_REGEX } from "./partial_conversation/partial_conversation__GENERALIZED__VALUE_REGEX";
import { swapCoinToToken } from "./swapCoinToToken";
import { getCallbackData, getTokenAddress } from "./utils/common";
import {
    getUserSessionDataPropertyNameAndVALUEFromCallbackData,
    getUserSessionDataPropertyValueFromCTX,
} from "./utils/util";

export async function conversation_swapCoinToToken_amount(
    conversation: BotConversation,
    ctx: BotContext
) {
    const [callbackData, tokenAddress] = await Promise.all([
        getCallbackData(ctx),
        getTokenAddress(ctx),
    ]);

    const userSessionDataProperty_data =
        await getUserSessionDataPropertyNameAndVALUEFromCallbackData(
            callbackData,
            "cb_"
        );

    // Handle Custom Amount
    if (callbackData === "cb_swapCoinToToken_amount_VALUE_custom") {
        const result =
            await partial_conversation_swapCoinToToken_amount_VALUE_REGEX(
                conversation,
                ctx,
                userSessionDataProperty_data
            );

        ctx = result.ctx;

        if (result.isResultValid) {
            ctx.session.swapCoinToToken_amount_selected =
                ctx.session.swapCoinToToken_amount_custom;

            ctx.temp.shouldEditCurrentCTXMessage = true; // Unnecessary due to partial_conversation_swapCoinToToken_amount_VALUE_REGEX
            ctx.temp.conversationMethodReturnedANewCTX = true; // Unnecessary due to partial_conversation_swapCoinToToken_amount_VALUE_REGEX
        }
    }
    // Handled Predefined Amount
    else {
        const tokenBuyAmount =
            await getUserSessionDataPropertyValueFromCTX<number>(ctx);

        ctx.session.swapCoinToToken_amount_selected = tokenBuyAmount;

        ctx.temp.shouldEditCurrentCTXMessage = true;
    }
    await swapCoinToToken.swapCoinToToken(ctx);
}

bot.use(
    createConversation(
        conversation_swapCoinToToken_amount,
        "conversation_swapCoinToToken_amount"
    )
);

async function cb_swapCoinToToken_amount_VALUE_REGEX(ctx: BotContext) {
    // await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    // await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    // await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await ctx.conversation.enter("conversation_swapCoinToToken_amount");
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapCoinToToken_amount_VALUE_([^\s]+)/,
    cb_swapCoinToToken_amount_VALUE_REGEX
);
