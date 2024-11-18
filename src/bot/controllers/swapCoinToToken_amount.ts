import { createConversation } from "@grammyjs/conversations";
import bot from "../bot_init";
import getBotShared from "../defined/BotShared";
import { BotContext, BotConversation } from "../utils/util_bot";
import { formatAndValidateInput_number_greater_than_or_equal_to_0, getCallbackData, getTokenAddress } from "./utils/common";
import { getUserSessionDataPropertyValueFromCTX } from "./utils/util";
import { swapCoinToToken } from "./swapCoinToToken";

export async function conversation_swapCoinToToken_amount(
    conversation: BotConversation,
    ctx: BotContext
) {
    const [callbackData, tokenAddress] = await Promise.all([
        getCallbackData(ctx),
        getTokenAddress(ctx),
    ]);

    const tokenInformation = await getBotShared()
        .getTokenClient()
        .getTokenInformation(tokenAddress);

    // Handle Custom Amount
    if (callbackData === "cb_swapCoinToToken_amount_VALUE_custom") {
        await ctx.reply(
            `Please enter the amount of ${tokenInformation.ticker} you wish to buy:`
        );

        ctx = await conversation.wait();
        const { message } = ctx;

        // const customAmount = await conversation.form.number(); // TODO: TEST THIS METHOD

        const {
            resultFormattedValidated: resultFormattedValidated,
            isResultValid: isResultValid,
        } = await formatAndValidateInput_number_greater_than_or_equal_to_0(message?.text);
    

        if (!isResultValid || !resultFormattedValidated) {
            await ctx.reply(
                `Invalid Invalid ${tokenInformation.ticker} amount. amount.`
            );
            await swapCoinToToken.swapCoinToToken(ctx);
            return;
            // TODO: MAYBE RE-ENTER CONVERSATION AND ASK AGAIN?
        }

        ctx.session.swapCoinToToken_amount_custom = resultFormattedValidated;
        ctx.session.swapCoinToToken_amount_selected = resultFormattedValidated;

        ctx.temp.shouldEditCurrentCTXMessage = true;
        ctx.temp.conversationMethodReturnedANewCTX = true;
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
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    // await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await ctx.conversation.enter("conversation_swapCoinToToken_amount");
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapCoinToToken_amount_VALUE_([^\s]+)/,
    cb_swapCoinToToken_amount_VALUE_REGEX
);
