import { buy } from "../..";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";

async function fetchTrxAmountByButtonId(
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
        throw new Error("User settings not found");
    }

    switch (buttonId) {
        case "swap_buybutton_tl_cb":
            return settings.buyTopLeftX;
        case "swap_buybutton_tc_cb":
            return settings.buyTopCenterX;
        case "swap_buybutton_tr_cb":
            return settings.buyTopRightX;
        case "swap_buybutton_bl_cb":
            return settings.buyBottomLeftX;
        case "swap_buybutton_br_cb":
            return settings.buyBottomRightX;
        default:
            throw new Error("Invalid button ID");
    }
}

export async function buyTrxConversation(
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
        if (callbackData === "swap_buybutton_x_cb") {
            await ctx.reply("Please enter the amount of TRX you wish to buy:");

            const { message } = await conversation.wait();

            const customAmount = parseFloat(message?.text || "0");

            if (isNaN(customAmount) || customAmount <= 0) {
                return await ctx.reply(
                    "Invalid amount. Please enter a valid number."
                );
            }

            await ctx.reply(`You have selected to buy ${customAmount} TRX.`);

            ctx.session.buyamount = customAmount;

            return;
        } else {
            try {
                const trxAmount = await fetchTrxAmountByButtonId(
                    userId.toString(),
                    callbackData
                );

                await ctx.answerCallbackQuery();
                ctx.session.buyamount = trxAmount;
                await buy.start(ctx, true);
            } catch (error) {
                await ctx.reply(
                    "An error occurred while fetching your settings."
                );
            }
            return;
        }
    }
}
