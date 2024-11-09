import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import { swapCoinToToken } from "./swapCoinToToken";
import { BotContext, BotConversation } from "../../utils/bot_utility";

// const PRISMA_CLIENT = getPrismaClientSingleton();

async function getTokenAmountFromCallbackData(
    ctx: BotContext
): Promise<number> {
    // const userSettings = await PRISMA_CLIENT.settings.findUnique({
    //     where: {
    //         userId: userId,
    //     },
    // });

    // if (!userSettings) {
    //     throw new Error("User settings not found");
    // }

    switch (ctx.callbackQuery?.data) {
        case "cb_swapCoinToToken_amount_LOCATION_0_0":
            return ctx.session.swapCoinToToken_amount_1;
        case "cb_swapCoinToToken_amount_LOCATION_0_1":
            return ctx.session.swapCoinToToken_amount_2;
        case "cb_swapCoinToToken_amount_LOCATION_0_2":
            return ctx.session.swapCoinToToken_amount_3;
        case "cb_swapCoinToToken_amount_LOCATION_1_0":
            return ctx.session.swapCoinToToken_amount_4;
        case "cb_swapCoinToToken_amount_LOCATION_1_1":
            return ctx.session.swapCoinToToken_amount_5;
        default:
            throw new Error("Invalid button ID");
    }
}

export async function conversation_swapCoinToToken_amount(
    conversation: BotConversation,
    ctx: BotContext
) {
    const callbackData = ctx.callbackQuery?.data;
    const userId = ctx.update.callback_query?.from.id;

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }

    if (callbackData) {
        if (callbackData === "cb_swapCoinToToken_amount_LOCATION_CUSTOM") {
            await ctx.reply("Please enter the amount of TRX you wish to buy:");

            const { message } = await conversation.wait();

            const customAmount = parseFloat(message?.text || "0");

            if (isNaN(customAmount) || customAmount < 0) {
                return await ctx.reply(
                    "Invalid amount. Please enter a valid number."
                );
            }

            //   await ctx.reply(`You have selected to buy ${customAmount} TRX.`);

            ctx.session.swapCoinToToken_amount_selected = customAmount;

            // const updatedSettings = await PRISMA_CLIENT.settings.update({
            //     where: { userId: userId.toString() },
            //     data: {
            //         buyCustomX: customAmount,
            //         selectedBuy: customAmount,
            //     },
            // });

            ctx.temp.selectedswapBuyAmountUpdated = true;
            await swapCoinToToken.swapCoinToToken(ctx);

            return;
        } else {
            try {
                const tokenBuyAmount = await getTokenAmountFromCallbackData(
                    ctx
                );

                ctx.session.swapCoinToToken_amount_selected = tokenBuyAmount;

                // const updatedSettings = await PRISMA_CLIENT.settings.update({
                //     where: { userId: userId.toString() },
                //     data: {
                //         selectedBuy: tokenBuyAmount,
                //     },
                // });

                // console.log("updatedSettings", updatedSettings);
                // console.log("updatedSettings.selectedBuy", updatedSettings.selectedBuy);
            } catch (error) {
                await ctx.reply(
                    "An error occurred while fetching your settings."
                );
            }

            ctx.temp.selectedswapBuyAmountUpdated = true;
            await swapCoinToToken.swapCoinToToken(ctx);

            return;
        }
    }
}

/* 
**************************************************
Buy Trx Conversation    
**************************************************
*/

bot.use(
    createConversation(
        conversation_swapCoinToToken_amount,
        "conversation_swapCoinToToken_amount"
    )
);

bot.callbackQuery(/cb_swapCoinToToken_amount_LOCATION_([^\s]+)/, async (ctx) => {
    await ctx.conversation.enter("conversation_swapCoinToToken_amount");
    await ctx.answerCallbackQuery();
});
