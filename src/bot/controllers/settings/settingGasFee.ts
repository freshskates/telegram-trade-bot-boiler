import { CallbackQueryContext } from "grammy";
// import { gasFee } from "../..";
import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import getDatabaseClientPrismaSingleton from "../../defined/DatabaseClientPrisma";
import { BotContext, BotConversation } from "../../utils/bot_utility";

const prisma = getDatabaseClientPrismaSingleton();

export const setGas = async (conversation: BotConversation, ctx: any) => {
    const callbackData = ctx.callbackQuery.data; // This should be the callback data from the button

    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }

    let selectedGasFee = 50;

    let gasSetting;

    if (callbackData === "cb_settings_swapTokenToCoin_gas_fee_LOCATION_0_0") {
        gasSetting = "Economy 🐴";
        selectedGasFee = 50;
    } else if (callbackData === "cb_settings_swapTokenToCoin_gas_fee_LOCATION_0_1") {
        gasSetting = "Normal 🚀";
        selectedGasFee = 100;
    } else if (callbackData === "cb_settings_swapTokenToCoin_gas_fee_LOCATION_0_2") {
        gasSetting = "Ultra 🦄";
        selectedGasFee = 200;
    } else if (callbackData === "cb_settings_swapTokenToCoin_gas_fee_LOCATION_CUSTOM") {
        await ctx.reply("Please enter your custom gas amount (in TRX):");

        const {
            msg: { text: customGas },
        } = await conversation.waitFor("message");

        if (!customGas) {
            await ctx.reply("Invalid input. Please enter a numeric value.");
            return;
        }

        const customGasNumber = parseFloat(customGas);

        selectedGasFee = customGasNumber;

        if (!isNaN(customGasNumber)) {
            gasSetting = `Custom: ${customGasNumber} TRX`;
        } else {
            await ctx.reply("Invalid input. Please enter a numeric value.");
            return;
        }
    }

    // save to db

    try {
        const updatedSettings = await prisma.settings.update({
            where: { userId: userId.toString() },
            data: {
                gasFee: selectedGasFee,
            },
        });
    } catch (error) {
        console.error("Error updating settings:", error);
        await ctx.reply(
            "There was an error saving your settings. Please try again."
        );
    }

    await ctx.reply(`You have selected ${gasSetting} gas setting.`);
    //   conversation.session.gasSetting = gasSetting;

    // await ctx.answerCallbackQuery();  // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION
};

export const start = async (ctx: CallbackQueryContext<BotContext>) => {
    await ctx.conversation.exit();
    await ctx.conversation.reenter("set_gas");
    await ctx.answerCallbackQuery();
};

/* 
**************************************************
Gas Fees Setting Conversation   
**************************************************
*/

bot.use(createConversation(setGas, "conversation_gasSetting"));
bot.callbackQuery("cb_settings_swapTokenToCoin_gas_fee_LOCATION_0_0", async (ctx) => {
    await ctx.conversation.enter("conversation_gasSetting");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_settings_swapTokenToCoin_gas_fee_LOCATION_0_1", async (ctx) => {
    await ctx.conversation.enter("conversation_gasSetting");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_settings_swapTokenToCoin_gas_fee_LOCATION_0_2", async (ctx) => {
    await ctx.conversation.enter("conversation_gasSetting");
    await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_settings_swapTokenToCoin_gas_fee_LOCATION_CUSTOM", async (ctx) => {
    await ctx.conversation.enter("conversation_gasSetting");
    await ctx.answerCallbackQuery();
});
