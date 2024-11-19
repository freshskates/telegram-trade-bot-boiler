import { createConversation } from "@grammyjs/conversations";
import bot from "../bot_init";
import { BotContext, BotConversation } from "../utils/util_bot";
import { partial_conversation_swapCoinToToken_slippage_VALUE_REGEX } from "./partial_conversation/partial_conversation__GENERALIZED__VALUE_REGEX";
import { swapCoinToToken } from "./swapCoinToToken";
import { getCallbackData } from "./utils/common";
import { getUserSessionDataPropertyNameAndVALUEFromCallbackData } from "./utils/util";

export async function conversation_swapCoinToToken_slippage_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext
) {
    const callbackData = await getCallbackData(ctx);

    const userSessionDataProperty_data =
        await getUserSessionDataPropertyNameAndVALUEFromCallbackData(
            callbackData,
            "cb_"
        );

    // Handle Custom Slippage value
    if (callbackData === "cb_swapCoinToToken_slippage_VALUE_custom") {
        const result =
            await partial_conversation_swapCoinToToken_slippage_VALUE_REGEX(
                conversation,
                ctx,
                userSessionDataProperty_data
            );

        ctx = result.ctx;

        if (result.isResultValid) {
            ctx.session.swapCoinToToken_slippage_selected =
                ctx.session.swapCoinToToken_slippage_custom;

            ctx.temp.shouldEditCurrentCTXMessage = true; // Unnecessary due to partial_conversation_swapCoinToToken_slippage_VALUE_REGEX
            ctx.temp.conversationMethodReturnedANewCTX = true; // Unnecessary due to partial_conversation_swapCoinToToken_slippage_VALUE_REGEX
        }
    }
    // Handle Predefined Slippage value
    else {
        ctx.session.swapCoinToToken_slippage_selected =
            ctx.session.swapCoinToToken_slippage_1;

        ctx.temp.shouldEditCurrentCTXMessage = true;
    }

    await swapCoinToToken.swapCoinToToken(ctx);
}

bot.use(
    createConversation(
        conversation_swapCoinToToken_slippage_VALUE_REGEX,
        "conversation_swapCoinToToken_slippage_VALUE_REGEX"
    )
);

async function cb_swapCoinToToken_slippage_VALUE_REGEX(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    // await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await ctx.conversation.enter(
        "conversation_swapCoinToToken_slippage_VALUE_REGEX"
    );
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapCoinToToken_slippage_VALUE_([^\s]+)/,
    cb_swapCoinToToken_slippage_VALUE_REGEX
);
