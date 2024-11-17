import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import { BotContext, BotConversation } from "../../utils/util_bot";
import { swapTokenToCoin } from "./swapTokenToCoin";
import { NoAuthorError, NoCallbackDataError } from "../../utils/error";

export async function conversation_swapTokenToCoin_slippage_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext
) {
    const callbackData = ctx.callbackQuery?.data;

    if (!callbackData) {
        throw new NoCallbackDataError(`${callbackData}`);
    }

    // const userId = ctx.update.callback_query?.from.id;
    const userId = ctx.from?.id;

    if (!userId) {
        throw new NoAuthorError(`${userId}`);
    }

    if (callbackData === "cb_swapTokenToCoin_slippage_VALUE_custom") {
        await ctx.reply(
            "Please enter the custom slippage percentage you wish to use:"
        );

        ctx = await conversation.wait();
        const { message } = ctx;

        const customSlippage = parseFloat(message?.text || "0");

        if (isNaN(customSlippage) || customSlippage < 0) {
            await ctx.reply(
                "Invalid slippage value. Please enter a valid percentage."
            );
            await swapTokenToCoin.swapTokenToCoin(ctx);
            return;
            
            // TODO: MAYBE RE-ENTER CONVERSATION AND ASK AGAIN?

        }

        ctx.session.swapTokenToCoin_slippage_custom = customSlippage;
        ctx.session.swapTokenToCoin_slippage_selected = customSlippage;
        ctx.temp.shouldEditCurrentCTXMessage = true;
        ctx.temp.conversationMethodReturnedANewCTX = true;

        await ctx.reply(
            `You have selected to use ${customSlippage}% slippage.`
        );
    } else {
        ctx.session.swapTokenToCoin_slippage_selected =
            ctx.session.swapTokenToCoin_slippage_1;

        ctx.temp.shouldEditCurrentCTXMessage = true;

        await ctx.reply(
            `You have selected to use ${ctx.session.swapTokenToCoin_slippage_selected}% slippage.`
        );
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
