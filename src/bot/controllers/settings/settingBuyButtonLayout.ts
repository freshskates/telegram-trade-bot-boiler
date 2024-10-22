import { createConversation } from "@grammyjs/conversations";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotConversation } from "../../../utils";
import bot from "../../bot_init";

const prisma = getPrismaClientSingleton();

export const conversation_buyButtonLayout = async (
    conversation: BotConversation,
    ctx: any
) => {
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }

    const callbackData = ctx.callbackQuery.data;

    let settingField: string;
    let settingLabel: string;

    if (callbackData === "cb_buy_button_tl") {
        settingField = "buyTopLeftX";
        settingLabel = "Top Left";
    } else if (callbackData === "cb_buy_button_tc") {
        settingField = "buyTopCenterX";
        settingLabel = "Top Center";
    } else if (callbackData === "cb_buy_button_tr") {
        settingField = "buyTopRightX";
        settingLabel = "Top Right";
    } else if (callbackData === "cb_buy_button_bl") {
        settingField = "buyBottomLeftX";
        settingLabel = "Bottom Left";
    } else if (callbackData === "cb_buy_button_br") {
        settingField = "buyBottomRightX";
        settingLabel = "Bottom Right";
    } else {
        await ctx.reply("Invalid selection.");
        return;
    }

    await ctx.reply(
        `You selected ${settingLabel}. Please enter the TRX amount:`
    );

    const {
        msg: { text: trxAmountText },
    } = await conversation.waitFor("message");

    if (!trxAmountText) {
        await ctx.reply("Invalid input. Please enter a numeric TRX amount.");
        return;
    }

    const trxAmount = parseFloat(trxAmountText);

    if (isNaN(trxAmount) || trxAmount <= 0) {
        await ctx.reply(
            "Invalid input. Please enter a valid numeric TRX amount."
        );
        return;
    }

    // Update the database with the new value
    try {
        const updatedSettings = await prisma.settings.update({
            where: { userId: userId.toString() },
            data: {
                [settingField]: trxAmount,
            },
        });

        await ctx.reply(
            `Setting saved: ${settingLabel} TRX amount set to ${trxAmount} TRX.`
        );
    } catch (error) {
        console.error("Error updating settings:", error);
        await ctx.reply(
            "There was an error saving your settings. Please try again."
        );
    }

    // await ctx.answerCallbackQuery();  // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION

};

/* 
**************************************************
Buy Button TRX Settings Conversation    
************************************************** 
*/


bot.use(
    createConversation(
        conversation_buyButtonLayout,
        "conversation_trxAmountSetting"
    )
);

bot.callbackQuery("cb_buy_button_tl", async (ctx) => {
    await ctx.conversation.enter("conversation_trxAmountSetting");
    await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("cb_buy_button_tc", async (ctx) => {
    await ctx.conversation.enter("conversation_trxAmountSetting");
    await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("cb_buy_button_tr", async (ctx) => {
    await ctx.conversation.enter("conversation_trxAmountSetting");
    await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("cb_buy_button_bl", async (ctx) => {
    await ctx.conversation.enter("conversation_trxAmountSetting");
    await ctx.answerCallbackQuery(); 
});

bot.callbackQuery("cb_buy_button_br", async (ctx) => {
    await ctx.conversation.enter("conversation_trxAmountSetting");
    await ctx.answerCallbackQuery(); 
});