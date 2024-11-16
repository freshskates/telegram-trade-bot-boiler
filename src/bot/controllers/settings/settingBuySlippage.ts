import { createConversation } from "@grammyjs/conversations";
import { CallbackQueryContext } from "grammy";
import bot from "../../bot_init";
import getDatabaseClientPrismaSingleton from "../../defined/DatabaseClientPrisma";
import { BotContext, BotConversation } from "../../utils/bot_utility";
import root_settings from "../display/root_settings";

const prisma = getDatabaseClientPrismaSingleton();

export const conversation_settingBuySlippage = async (
    conversation: BotConversation,
    ctx: BotContext
) => {
    const callbackData = ctx.callbackQuery?.data;
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }

    if (callbackData !== "cb_buy_setting_slippage") {
        await ctx.reply("Invalid selection.");
        return;
    }

    await ctx.reply("Please enter the new slippage percentage for Buy:");

    const { message } = await conversation.waitFor("message");

    const newSlippageAmount = parseFloat(message?.text || "0");

    if (isNaN(newSlippageAmount) || newSlippageAmount <= 0) {
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
                slippageBuy: newSlippageAmount,
            },
        });

        await ctx.reply(
            `The buy slippage has been updated to ${newSlippageAmount}%.`
        );

        // FIXME: HJOSEOPH
        await root_settings.cb_root_settings(ctx);
    } catch (error) {
        console.error("Error updating settings:", error);
        await ctx.reply(
            "There was an error saving your settings. Please try again."
        );
    }

    // await ctx.answerCallbackQuery();  // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION
};

// FIXME: IS CallbackQueryContext<BotContext> Necessary instead of BotContext only
export const start = async (ctx: CallbackQueryContext<BotContext>) => {
    await ctx.conversation.exit();
    // WARNING: IDK
    // FIXME: IDK WHAT THE FUCK IS set_buy_slippage
    await ctx.conversation.reenter("set_buy_slippage"); // TODO: WTF IS THIS
    await ctx.answerCallbackQuery();
};

/* 
**************************************************
Settings Menu - Set Buy Slippage
**************************************************
*/
bot.use(
    createConversation(
        conversation_settingBuySlippage,
        "conversation_swapBuySlippageSetting"
    )
);

async function cb_buy_setting_slippage(ctx: CallbackQueryContext<BotContext>) {
    await ctx.conversation.enter("conversation_swapBuySlippageSetting");
    await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_buy_setting_slippage", cb_buy_setting_slippage);
