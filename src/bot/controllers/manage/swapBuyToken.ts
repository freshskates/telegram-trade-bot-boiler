import { createConversation } from "@grammyjs/conversations";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";
import bot from "../../bot_init";
import { displaySwapBuyToken } from "../../display/displaySwapBuyToken";

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
        case "cb_swapBuyToken_tl":
            return userSettings.buyTopLeftX;
        case "cb_swapBuyToken_tc":
            return userSettings.buyTopCenterX;
        case "cb_swapBuyToken_tr":
            return userSettings.buyTopRightX;
        case "cb_swapBuyToken_bl":
            return userSettings.buyBottomLeftX;
        case "cb_swapBuyToken_br":
            return userSettings.buyBottomRightX;
        default:
            throw new Error("Invalid button ID");
    }
}

export async function conversation_swapBuyToken(
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

        const PRISMA_CLIENT = getPrismaClientSingleton();

        if (callbackData === "cb_swapBuyToken_x") {
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

            const updatedSettings = await PRISMA_CLIENT.settings.update({
                where: { userId: userId.toString() },
                data: {
                    buyCustomX: customAmount,
                    selectedBuy: customAmount,
                },
            });
            
            ctx.session.swapBuyTokenUpdated = true;
            await displaySwapBuyToken.displaySwapBuyToken(ctx);

            return;
        } else {
            try {
                const tokenBuyAmount = await getTokenAmountFromCallbackData(
                    userId.toString(),
                    callbackData
                );

                ctx.session.buyamount = tokenBuyAmount;

                const updatedSettings = await PRISMA_CLIENT.settings.update({
                    where: { userId: userId.toString() },
                    data: {
                        selectedBuy: tokenBuyAmount,
                    },
                });
                
                ctx.session.swapBuyTokenUpdated = true;
                await displaySwapBuyToken.displaySwapBuyToken(ctx);
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

bot.use(createConversation(conversation_swapBuyToken, "conversation_swapBuyToken"));

bot.callbackQuery("cb_swapBuyToken_tl", async (ctx) => {
    await ctx.conversation.enter("conversation_swapBuyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swapBuyToken_tc", async (ctx) => {
    await ctx.conversation.enter("conversation_swapBuyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swapBuyToken_tr", async (ctx) => {
    await ctx.conversation.enter("conversation_swapBuyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swapBuyToken_bl", async (ctx) => {
    await ctx.conversation.enter("conversation_swapBuyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swapBuyToken_br", async (ctx) => {
    await ctx.conversation.enter("conversation_swapBuyToken");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swapBuyToken_x", async (ctx) => {
    await ctx.conversation.enter("conversation_swapBuyToken");
    await ctx.answerCallbackQuery();
});
