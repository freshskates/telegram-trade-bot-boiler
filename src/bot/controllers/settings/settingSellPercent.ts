import { createConversation } from "@grammyjs/conversations";
import { CallbackQueryContext } from "grammy";
import bot from "../../bot_init";
import getDatabaseClientPrismaSingleton from "../../defined/DatabaseClientPrisma";
import { BotContext, BotConversation } from "../../utils/util_bot";

const prisma = getDatabaseClientPrismaSingleton();

export const settingSellPercent = async (
    conversation: BotConversation,
    ctx: BotContext
) => {
    const callbackData = ctx.callbackQuery?.data; // This should be the callback data from the button
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }

    let selectedPercentField: string;
    let percentSetting: string;

    if (callbackData === "cb_settings_swapTokenToCoin_amount_precent_VALUE_1") {
        percentSetting = "Sell Left Percent";
        selectedPercentField = "sellLeftPercentX";
    } else if (callbackData === "cb_settings_swapTokenToCoin_amount_precent_VALUE_2") {
        percentSetting = "Sell Right Percent";
        selectedPercentField = "sellRightPercentX";
    } else {
        await ctx.reply("Invalid selection.");
        return;
    }

    await ctx.reply(
        `Please enter the new percentage amount for ${percentSetting}:`
    );

    const { message } = await conversation.waitFor("message");

    const newPercentAmount = parseFloat(message?.text || "0");

    if (isNaN(newPercentAmount) || newPercentAmount <= 0) {
        await ctx.reply(
            "Invalid input. Please enter a valid numeric percentage."
        );
        return;
    }

    // Save to the database
    try {
        const updatedSettings = await prisma.settings.update({
            where: { userId: userId.toString() },
            data: {
                [selectedPercentField]: newPercentAmount,
            },
        });

        await ctx.reply(
            `The ${percentSetting} has been updated to ${newPercentAmount}%.`
        );
    } catch (error) {
        console.error("Error updating settings:", error);
        await ctx.reply(
            "There was an error saving your settings. Please try again."
        );
    }

    // await ctx.answerCallbackQuery();  // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION
};

export const start = async (ctx: CallbackQueryContext<BotContext>) => {
    await ctx.conversation.exit();
    await ctx.conversation.reenter("set_sell_percent");
    await ctx.answerCallbackQuery();
};

/* 
**************************************************
Settings Menu - Set Sell Percents
**************************************************
*/

bot.use(
    createConversation(settingSellPercent, "conversation_sellPercentSetting")
);

bot.callbackQuery("cb_settings_swapTokenToCoin_amount_precent_VALUE_1", async (ctx) => {
    await ctx.conversation.enter("conversation_sellPercentSetting");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_settings_swapTokenToCoin_amount_precent_VALUE_2", async (ctx) => {
    await ctx.conversation.enter("conversation_sellPercentSetting");
    await ctx.answerCallbackQuery();
});
