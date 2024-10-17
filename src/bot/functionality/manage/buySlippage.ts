import { createConversation } from "@grammyjs/conversations";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";
import bot from "../../bot_init";

async function fetchSlippageByButtonId(
    userId: string,
    buttonId: string
): Promise<number> {
    const prisma = getPrismaClientSingleton();
    const settings = await prisma.settings.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!settings) {
        throw new Error("Settings not found for user.");
    }

    if (buttonId === "cb_buy_slippagebutton") {
        return settings.slippageBuy;
    }

    return 0;
}

export async function slippageConversation(
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
        if (callbackData === "cb_buy_slippagebutton_x") {
            await ctx.reply(
                "Please enter the custom slippage percentage you wish to use:"
            );

            const { message } = await conversation.wait();

            const customSlippage = parseFloat(message?.text || "0");

            if (isNaN(customSlippage) || customSlippage <= 0) {
                return await ctx.reply(
                    "Invalid slippage value. Please enter a valid percentage."
                );
            }

            ctx.session.buyslippage = customSlippage;

            await ctx.reply(
                `You have selected to use ${customSlippage}% slippage.`
            );

            return;
        } else {
            const slippage = await fetchSlippageByButtonId(
                userId.toString(),
                callbackData
            );

            await ctx.reply(`You have selected to use ${slippage}% slippage.`);

            ctx.session.buyslippage = slippage;

            await ctx.answerCallbackQuery();
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
        slippageConversation,
        "conversation_buySlippage"
    )
);
bot.callbackQuery("cb_buy_slippagebutton", async (ctx) => {
    await ctx.conversation.enter("conversation_buySlippage");
});

bot.callbackQuery("cb_buy_slippagebutton_x", async (ctx) => {
    await ctx.conversation.enter("conversation_buySlippage");
});