import { createConversation } from "@grammyjs/conversations";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";
import bot from "../../bot_init";
import { buy } from "../buy";

async function getTokenAmountFromCallbackData(
    userId: string,
    CallbackData: string
): Promise<number> {
    const prisma = getPrismaClientSingleton();

    const userSettings = await prisma.settings.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!userSettings) {
        throw new Error("User settings not found");
    }

    switch (CallbackData) {
        case "cb_buyToken_tl":
            return userSettings.buyTopLeftX;
        case "cb_buyToken_tc":
            return userSettings.buyTopCenterX;
        case "cb_buyToken_tr":
            return userSettings.buyTopRightX;
        case "cb_buyToken_bl":
            return userSettings.buyBottomLeftX;
        case "cb_buyToken_br":
            return userSettings.buyBottomRightX;
        default:
            throw new Error("Invalid button ID");
    }
}

export async function conversation_buyToken(
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
        if (callbackData === "cb_buyToken_x") {
            await ctx.reply("Please enter the amount of TRX you wish to buy:");

            const { message } = await conversation.wait();

            const customAmount = parseFloat(message?.text || "0");

            if (isNaN(customAmount) || customAmount < 0) {
                return await ctx.reply(
                    "Invalid amount. Please enter a valid number."
                );
            }

            //   await ctx.reply(`You have selected to buy ${customAmount} TRX.`);

            ctx.session.buyamount = customAmount;

            const prisma = getPrismaClientSingleton();
            const updatedSettings = await prisma.settings.update({
                where: { userId: userId.toString() },
                data: {
                    buyCustomX: customAmount,
                    selectedBuy: customAmount,
                },
            });

            await buy.displayBuyToken(ctx, true);

            return;
        } else {
            try {
                const tokenBuyAmount = await getTokenAmountFromCallbackData(
                    userId.toString(),
                    callbackData
                );

                ctx.session.buyamount = tokenBuyAmount;

                const prisma = getPrismaClientSingleton();
                const updatedSettings = await prisma.settings.update({
                    where: { userId: userId.toString() },
                    data: {
                        selectedBuy: tokenBuyAmount,
                    },
                });

                await buy.displayBuyToken(ctx, true);
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

bot.use(createConversation(conversation_buyToken, "conversation_buyToken"));

bot.callbackQuery("cb_buyToken_tl", async (ctx) => {
    await ctx.conversation.enter("conversation_buyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_buyToken_tc", async (ctx) => {
    await ctx.conversation.enter("conversation_buyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_buyToken_tr", async (ctx) => {
    await ctx.conversation.enter("conversation_buyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_buyToken_bl", async (ctx) => {
    await ctx.conversation.enter("conversation_buyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_buyToken_br", async (ctx) => {
    await ctx.conversation.enter("conversation_buyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_buyToken_x", async (ctx) => {
    await ctx.conversation.enter("conversation_buyToken");
    await ctx.answerCallbackQuery();
});
