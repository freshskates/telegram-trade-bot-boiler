import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";

async function fetchSellSlippageByButtonId(
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

    if (buttonId === "sell_slippagebutton_cb") {
        return settings.slippageSell;
    }

    return 0;
}

export async function sellSlippageConversation(
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
        if (callbackData === "sell_slippagebutton_x_cb") {
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

            ctx.session.sellslippage = customSlippage;

            await ctx.reply(
                `You have selected to use ${customSlippage}% slippage.`
            );

            return;
        } else {
            const slippage = await fetchSellSlippageByButtonId(
                userId.toString(),
                callbackData
            );

            await ctx.reply(`You have selected to use ${slippage}% slippage.`);

            ctx.session.sellslippage = slippage;

            await ctx.answerCallbackQuery();
            return;
        }
    }
}
