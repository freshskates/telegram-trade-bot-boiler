import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import { BotContext, BotConversation } from "../../utils/util_bot";
import { getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData } from "../utils/util";
import getBotShared from "../../defined/BotShared";

// async function _getSession

async function conversation_settings_swapCoinToToken_amount_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext
) {
    const userId = ctx.from?.id;

    if (!userId) {
        await ctx.reply("User ID not found.");
        return;
    }

    const callbackData = ctx.callbackQuery?.data;

    // TODO: FIX ME ASSHOLE, NEED TO BE STRING, IDK HOW YOU WANT HANDLE
    if (!callbackData){
        return
    }


    console.log("FUCK YOU");

    console.log(callbackData);
    console.log(await getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData(callbackData, "cb_settings_"));

    let settingField: string;
    // let settingLabel: string;

    // if (callbackData === "cb_settings_swapCoinToToken_amount_VALUE_1") {
    //     settingField = "buyTopLeftX";
    //     // settingLabel = "Top Left";
    // } else if (callbackData === "cb_settings_swapCoinToToken_amount_VALUE_2") {
    //     settingField = "buyTopCenterX";
    //     // settingLabel = "Top Center";
    // } else if (callbackData === "cb_settings_swapCoinToToken_amount_VALUE_3") {
    //     settingField = "buyTopRightX";
    //     // settingLabel = "Top Right";
    // } else if (callbackData === "cb_settings_swapCoinToToken_amount_VALUE_4") {
    //     settingField = "buyBottomLeftX";
    //     // settingLabel = "Bottom Left";
    // } else if (callbackData === "cb_settings_swapCoinToToken_amount_VALUE_5") {
    //     settingField = "buyBottomRightX";
    //     // settingLabel = "Bottom Right";
    // } else {
    //     await ctx.reply("Invalid selection.");
    //     return;
    // }

    await ctx.reply(
        `Please enter the ${getBotShared().getCoinInformation().ticker} amount:`
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
}

/* 
**************************************************
Buy Button TRX Settings Conversation    
************************************************** 
*/

bot.use(
    createConversation(
        conversation_settings_swapCoinToToken_amount_VALUE_REGEX,
        "conversation_settings_swapCoinToToken_amount_VALUE_REGEX"
    )
);

async function cb_settings_swapCoinToToken_amount_VALUE_REGEX(ctx: BotContext) {
    await ctx.conversation.enter(
        "conversation_settings_swapCoinToToken_amount_VALUE_REGEX"
    );
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_settings_swapCoinToToken_amount_VALUE_([^\s]+)/,
    cb_settings_swapCoinToToken_amount_VALUE_REGEX,
);
