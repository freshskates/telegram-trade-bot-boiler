import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import { BotContext, BotConversation } from "../../utils/bot_utility";
import { swapTokenToCoin } from "./swapTokenToCoin";

// Function to fetch sell percent by button ID
async function fetchSellPercentByButtonId(ctx: BotContext): Promise<number> {
    // const prisma = getDatabaseClientPrismaSingleton();

    // const settings = await prisma.settings.findUnique({
    //     where: {
    //         userId: userId,
    //     },
    // });

    // if (!settings) {
    //     throw new Error("User settings not found");
    // }

    // switch (buttonId) {
    //     case "cb_swapTokenToCoin_amount_percent_LOCATION_0_0":
    //         return settings.sellLeftPercentX;
    //     case "cb_swapTokenToCoin_amount_percent_LOCATION_0_1":
    //         return settings.sellRightPercentX;
    //     default:
    //         throw new Error("Invalid button ID");
    // }

    switch (ctx.callbackQuery?.data) {
        case "cb_swapTokenToCoin_amount_percent_LOCATION_0_0":
            return ctx.session.swapTokenToCoin_amount_percent_1;
        case "cb_swapTokenToCoin_amount_percent_LOCATION_0_1":
            return ctx.session.swapTokenToCoin_amount_percent_2;
        default:
            throw new Error("Invalid button ID");
    }
}

export async function conversation_sellTrx(
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
        if (
            callbackData === "cb_swapTokenToCoin_amount_percent_LOCATION_CUSTOM"
        ) {
            await ctx.reply(
                "Please enter the percent of TRX you wish to sell:"
            );

            const { message } = await conversation.wait();

            const customPercent = parseFloat(message?.text || "0");

            if (
                isNaN(customPercent) ||
                customPercent < 0 ||
                customPercent > 100
            ) {
                return await ctx.reply(
                    "Invalid percent. Please enter a valid number between 1 and 100."
                );
            }

            await ctx.reply(
                `You have selected to sell ${customPercent}% of your TRX.` // FIXME: Should be Coin Name not TRX
            );

            // const prisma = getDatabaseClientPrismaSingleton();
            // const updatedSettings = await prisma.settings.update({
            //   where: { userId: userId.toString() },
            //   data: {
            //     sellCustomX: customPercent,
            //     swapTokenToCoin_amount_percent_selected: customPercent,
            //   },
            // });

            ctx.session.swapTokenToCoin_amount_percent_custom = customPercent;
            ctx.session.swapTokenToCoin_amount_percent_selected = customPercent;

            ctx.temp.shouldEditCurrentCTXMessage = true;
            ctx.temp.conversationMethodReturnedANewCTX = true;
            await swapTokenToCoin.swapTokenToCoin(ctx);

            return;
        } else {
            try {
                const sellPercent = await fetchSellPercentByButtonId(ctx);

                // const prisma = getDatabaseClientPrismaSingleton();
                // const updatedSettings = await prisma.settings.update({
                //   where: { userId: userId.toString() },
                //   data: {
                //     swapTokenToCoin_amount_percent_selected: sellPercent,
                //   },
                // });

                ctx.session.swapTokenToCoin_amount_percent_selected =
                    sellPercent;

                ctx.temp.shouldEditCurrentCTXMessage = true;
                ctx.temp.conversationMethodReturnedANewCTX = false;

                await swapTokenToCoin.swapTokenToCoin(ctx);
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
Sell Menu - Set Sell Percent
**************************************************
*/

bot.use(
    createConversation(conversation_sellTrx, "conversation_sellPercentMenu")
);

async function cb_swapTokenToCoin_amount_percent_LOCATION_REGEX(
    ctx: BotContext
) {
    // await ctx.deleteMessage();  // Delete current message
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await ctx.conversation.enter("conversation_sellPercentMenu");
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapTokenToCoin_amount_percent_LOCATION_([^\s]+)/,
    cb_swapTokenToCoin_amount_percent_LOCATION_REGEX
);
