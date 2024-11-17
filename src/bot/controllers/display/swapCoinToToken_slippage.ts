import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import { NoCallbackDataError } from "../../utils/error";
import { BotContext, BotConversation } from "../../utils/util_bot";
import { swapCoinToToken } from "./swapCoinToToken";

export async function conversation_swapCoinToToken_slippage_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext
) {
    const callbackData = ctx.callbackQuery?.data;

    if (!callbackData) {
        throw new NoCallbackDataError(`${callbackData}`);
    }

    // Handle Custom Slippage value
    if (callbackData === "cb_swapCoinToToken_slippage_VALUE_custom") {
        await ctx.reply(
            "Please enter the custom slippage percentage you wish to use:"
        );

        ctx = await conversation.wait();
        const { message } = ctx;

        const customSlippage = parseFloat(message?.text || "0");

        if (isNaN(customSlippage) || customSlippage < 0) {
            await ctx.reply("Invalid slippage percentage.");
            await swapCoinToToken.swapCoinToToken(ctx);
            return;
            // TODO: MAYBE RE-ENTER CONVERSATION AND ASK AGAIN?
        }

        ctx.session.swapCoinToToken_slippage_custom = customSlippage;
        ctx.session.swapCoinToToken_slippage_selected = customSlippage; // Do not do "ctx.session.swapCoinToToken_slippage_selected = ctx.session.swapCoinToToken_slippage_custom" // This adds another read call
        ctx.temp.shouldEditCurrentCTXMessage = true;
        ctx.temp.conversationMethodReturnedANewCTX = true;

        await ctx.reply(
            `You have selected to use ${customSlippage}% slippage.`
        );
    }
    // Handle Predefined Slippage value
    else {
        ctx.session.swapCoinToToken_slippage_selected =
            ctx.session.swapCoinToToken_slippage_1;

        ctx.temp.shouldEditCurrentCTXMessage = true;

        
        await ctx.reply(
            `You have selected to use ${ctx.session.swapCoinToToken_slippage_selected}% slippage.`
        );
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
