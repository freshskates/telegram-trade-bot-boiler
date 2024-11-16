import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import { BotContext, BotConversation } from "../../utils/bot_utility";
import { swapCoinToToken } from "./swapCoinToToken";

// const PRISMA_CLIENT = getPrismaClientSingleton();

async function _getTokenAmountFromCallbackData(
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
        // Handle Custom Amount
        if (callbackData === "cb_swapCoinToToken_amount_LOCATION_CUSTOM") {
            await ctx.reply("Please enter the amount of TRX you wish to buy:");

            ctx = await conversation.wait();
            const { message } = ctx;

            const customAmount = parseFloat(message?.text || "0");

            // const customAmount = await conversation.form.number(); // TODO: TEST THIS METHOD

            if (isNaN(customAmount) || customAmount < 0) {
                return await ctx.reply(
                    "Invalid amount. Please enter a valid number."
                );
            }

            //   await ctx.reply(`You have selected to buy ${customAmount} TRX.`);

            ctx.session.swapCoinToToken_amount_custom = customAmount;
            ctx.session.swapCoinToToken_amount_selected = customAmount;

            // const updatedSettings = await PRISMA_CLIENT.settings.update({
            //     where: { userId: userId.toString() },
            //     data: {
            //         buyCustomX: customAmount,
            //         selectedBuy: customAmount,
            //     },
            // });

            ctx.temp.shouldEditCurrentCTXMessage = true;
            ctx.temp.conversationMethodReturnedANewCTX = true;

            await swapCoinToToken.swapCoinToToken(ctx);

            return;
        } else {
            try {
                const tokenBuyAmount = await _getTokenAmountFromCallbackData(
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

                ctx.temp.shouldEditCurrentCTXMessage = true;
                ctx.temp.conversationMethodReturnedANewCTX = false;

                await swapCoinToToken.swapCoinToToken(ctx);

            } catch (error) {
                await ctx.reply(
                    "An error occurred while fetching your settings."
                );
            }


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

async function cb_swapCoinToToken_amount_LOCATION_REGEX(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    // await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await ctx.conversation.enter("conversation_swapCoinToToken_amount");
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapCoinToToken_amount_LOCATION_([^\s]+)/,
    cb_swapCoinToToken_amount_LOCATION_REGEX
);
