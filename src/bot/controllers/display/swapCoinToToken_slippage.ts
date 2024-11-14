import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import { BotContext, BotConversation } from "../../utils/bot_utility";
import { swapCoinToToken } from "./swapCoinToToken";

// async function fetchSlippageByButtonId(
//     userId: string,
//     buttonId: string
// ): Promise<number> {
//     const prisma = getPrismaDatabaseClientSingleton();
//     const settings = await prisma.settings.findUnique({
//         where: {
//             userId: userId,
//         },
//     });

//     if (!settings) {
//         throw new Error("Settings not found for user.");
//     }

//     if (buttonId === "cb_swapCoinToToken_slippage") {
//         return settings.slippageBuy;
//     }

//     return 0;
// }

export async function conversation_swapCoinToToken_slippage(
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
        // Handle Custom Slippage value
        if (callbackData === "cb_swapCoinToToken_slippage_LOCATION_CUSTOM") {
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

            // const prisma = getPrismaClientSingleton();
            // const updatedSettings = await prisma.settings.update({
            //   where: { userId: userId.toString() },
            //   data: {
            //     slippageBuyCustom: customSlippage, // FIXME: Why is customSlippage here???????
            //     selectedBuySlippage: customSlippage,
            //   },
            // });

            ctx.session.swapCoinToToken_slippage_custom = customSlippage;
            ctx.session.swapCoinToToken_slippage_selected = customSlippage; // Do not do "ctx.session.swapCoinToToken_slippage_selected = ctx.session.swapCoinToToken_slippage_custom" // This adds another read call
            ctx.temp.selectedSwapBuyAmountUpdated = true;
            ctx.temp.conversationMethodReturnedANewCTX = true;

            await ctx.reply(
                `You have selected to use ${customSlippage}% slippage.`
            );

            await swapCoinToToken.swapCoinToToken(ctx);

            return;
        }
        // Handle Predefined Slippage value
        else {
            // const slippage = await fetchSlippageByButtonId(
            //     userId.toString(),
            //     callbackData
            // );

            // const prisma = getPrismaDatabaseClientSingleton();
            // const updatedSettings = await prisma.settings.update({
            //     where: { userId: userId.toString() },
            //     data: {
            //         selectedBuySlippage: slippage,
            //     },
            // });

            ctx.session.swapCoinToToken_slippage_selected =
                ctx.session.swapCoinToToken_slippage_1;
            ctx.temp.selectedSwapBuyAmountUpdated = true;
            ctx.temp.conversationMethodReturnedANewCTX = false;

            await ctx.reply(
                `You have selected to use ${ctx.session.swapCoinToToken_slippage_selected}% slippage.`
            );
            await swapCoinToToken.swapCoinToToken(ctx);

            return;
        }
    }
}

/* 
**************************************************
Buy Menu - Slippage Conversation
**************************************************
*/

bot.use(
    createConversation(
        conversation_swapCoinToToken_slippage,
        "conversation_swapCoinToToken_slippage"
    )
);

async function cb_conversation_swapCoinToToken_slippage(ctx: BotContext) {
    await ctx.conversation.enter("conversation_swapCoinToToken_slippage");
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapCoinToToken_slippage_LOCATION_([^\s]+)/,
    cb_conversation_swapCoinToToken_slippage
);

// bot.callbackQuery("cb_swapCoinToToken_slippage_x", async (ctx) => {
//     await ctx.conversation.enter("conversation_swapCoinToToken_slippage");
//     await ctx.answerCallbackQuery();
// });
