import { createConversation } from "@grammyjs/conversations";
import bot from "../bot_init";
import { NoAuthorError } from "../utils/error";
import { BotContext, BotConversation } from "../utils/util_bot";
import { partial_conversation_swapTokenToCoin_slippage_VALUE_REGEX } from "./partial_conversation/partial_conversation__GENERALIZED__VALUE_REGEX";
import { swapTokenToCoin } from "./swapTokenToCoin";
import { getCallbackData, getGrammyUser } from "./utils/common";
import { getUserSessionDataPropertyNameAndVALUEFromCallbackData } from "./utils/util";

export async function conversation_swapTokenToCoin_slippage_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext
) {
    const [callbackData, grammyUser] = await Promise.all([
        getCallbackData(ctx),
        getGrammyUser(ctx),
    ]);

    const userSessionDataProperty_data =
        await getUserSessionDataPropertyNameAndVALUEFromCallbackData(
            callbackData,
            "cb_"
        );

    // const userId = ctx.update.callback_query?.from.id;
    const grammyUserId = grammyUser.id;

    if (!grammyUserId) {
        throw new NoAuthorError(`${grammyUserId}`);
    }

    if (callbackData === "cb_swapTokenToCoin_slippage_VALUE_custom") {
        const reuslt =
            await partial_conversation_swapTokenToCoin_slippage_VALUE_REGEX(
                conversation,
                ctx,
                userSessionDataProperty_data
            );

        ctx = reuslt.ctx;

        if (reuslt.isResultValid) {
            ctx.session.swapTokenToCoin_slippage_selected =
                ctx.session.swapTokenToCoin_slippage_custom;

            ctx.temp.shouldEditCurrentCTXMessage = true; // Unnecessary due to partial_conversation_swapTokenToCoin_slippage_VALUE_REGEX
            ctx.temp.conversationMethodReturnedANewCTX = true; // Unnecessary due to partial_conversation_swapTokenToCoin_slippage_VALUE_REGEX
        }
    } else {
        ctx.session.swapTokenToCoin_slippage_selected =
            ctx.session.swapTokenToCoin_slippage_1;

        ctx.temp.shouldEditCurrentCTXMessage = true;
    }
    await swapTokenToCoin.swapTokenToCoin(ctx);
}

bot.use(
    createConversation(
        conversation_swapTokenToCoin_slippage_VALUE_REGEX,
        "conversation_swapTokenToCoin_slippage_VALUE_REGEX"
    )
);

async function cb_swapTokenToCoin_slippage_VALUE_REGEX(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    // await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await ctx.conversation.enter(
        "conversation_swapTokenToCoin_slippage_VALUE_REGEX"
    );
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapTokenToCoin_slippage_VALUE_([^\s]+)/,
    cb_swapTokenToCoin_slippage_VALUE_REGEX
);
