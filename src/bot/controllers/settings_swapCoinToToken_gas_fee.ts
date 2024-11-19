// import { gasFee } from "../..";
import { createConversation } from "@grammyjs/conversations";
import bot from "../bot_init";
import { BotContext, BotConversation } from "../utils/util_bot";
import { partial_conversation_swapCoinToToken_gas_fee_VALUE_REGEX } from "./partial_conversation/partial_conversation__GENERALIZED__VALUE_REGEX";
import settings from "./settings";
import { getCallbackData } from "./utils/common";
import { getUserSessionDataPropertyNameAndVALUEFromCallbackData } from "./utils/util";

async function conversation_settings_swapCoinToToken_gas_fee_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext
) {
    const callbackData = await getCallbackData(ctx);

    const userSessionDataProperty_data =
        await getUserSessionDataPropertyNameAndVALUEFromCallbackData(
            callbackData,
            "cb_settings_"
        );

    const result =
        await partial_conversation_swapCoinToToken_gas_fee_VALUE_REGEX(
            conversation,
            ctx,
            userSessionDataProperty_data
        );

    ctx = result.ctx;

    await settings.settings(ctx);
}

bot.use(
    createConversation(
        conversation_settings_swapCoinToToken_gas_fee_VALUE_REGEX,
        "conversation_settings_swapCoinToToken_gas_fee_VALUE_REGEX"
    )
);

async function cb_settings_swapCoinToToken_gas_fee_VALUE_REGEX(
    ctx: BotContext
) {
    await ctx.conversation.enter(
        "conversation_settings_swapCoinToToken_gas_fee_VALUE_REGEX"
    );
    await ctx.answerCallbackQuery();
}
bot.callbackQuery(
    /cb_settings_swapCoinToToken_gas_fee_VALUE_([^\s]+)/,
    cb_settings_swapCoinToToken_gas_fee_VALUE_REGEX
);
