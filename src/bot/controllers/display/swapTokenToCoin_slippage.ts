import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import { BotContext, BotConversation } from "../../utils/bot_utility";
import { swapTokenToCoin } from "./swapTokenToCoin";

export async function conversation_sellSlippage(
    conversation: BotConversation,
    ctx: BotContext
) {
    const callbackData = ctx.callbackQuery?.data;
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }

    if (callbackData) {
        if (callbackData === "cb_swapTokenToCoin_slippage_LOCATION_CUSTOM") {
            await ctx.reply(
                "Please enter the custom slippage percentage you wish to use:"
            );

            ctx = await conversation.wait();
            const { message } = ctx;

            const customSlippage = parseFloat(message?.text || "0");

            if (isNaN(customSlippage) || customSlippage < 0) {
                return await ctx.reply(
                    "Invalid slippage value. Please enter a valid percentage."
                );
            }

            ctx.session.swapTokenToCoin_slippage_custom = customSlippage;
            ctx.session.swapTokenToCoin_slippage_selected = customSlippage;
            ctx.temp.shouldEditCurrentCTXMessage = true;
            ctx.temp.conversationMethodReturnedANewCTX = true;

            await ctx.reply(
                `You have selected to use ${customSlippage}% slippage.`
            );
            await swapTokenToCoin.swapTokenToCoin(ctx);

            return;
        } else {
            // const slippage = await fetchSellSlippageByButtonId(
            //     userId.toString(),
            //     callbackData
            // );

            // const prisma = getPrismaDatabaseClientSingleton();
            // const updatedSettings = await prisma.settings.update({
            //     where: { userId: userId.toString() },
            //     data: {
            //         selectedSellSlippage: slippage,
            //     },
            // });

            ctx.session.swapTokenToCoin_slippage_selected =
                ctx.session.swapTokenToCoin_slippage_1;
            ctx.temp.shouldEditCurrentCTXMessage = true;
            ctx.temp.conversationMethodReturnedANewCTX = false;

            await ctx.reply(
                `You have selected to use ${ctx.session.swapTokenToCoin_slippage_selected}% slippage.`
            );

            await swapTokenToCoin.swapTokenToCoin(ctx);

            // await ctx.answerCallbackQuery();  // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION
            return;
        }
    }
}

/* 
**************************************************
Sell Menu - Set Sell Slippage
**************************************************
*/

bot.use(
    createConversation(
        conversation_sellSlippage,
        "conversation_swapTokenToCoin_slippage_LOCATION_REGEX"
    )
);

async function cb_swapTokenToCoin_slippage_LOCATION_REGEX(ctx: BotContext) {
    // await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await ctx.conversation.enter(
        "conversation_swapTokenToCoin_slippage_LOCATION_REGEX"
    );
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapTokenToCoin_slippage_LOCATION_([^\s]+)/,
    cb_swapTokenToCoin_slippage_LOCATION_REGEX
);
