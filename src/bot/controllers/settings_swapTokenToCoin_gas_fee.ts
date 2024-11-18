// import { gasFee } from "../..";
import { createConversation } from "@grammyjs/conversations";
import bot from "../bot_init";
import getBotShared from "../defined/BotShared";
import { BotContext, BotConversation } from "../utils/util_bot";
import {
    formatAndValidateInput_number_greater_than_or_equal_to_0,
    getCallbackData,
} from "./utils/common";
import { getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData } from "./utils/util";
import settings from "./settings";
import { partial_conversation_settings__GENERALIZED__VALUE_REGEX } from "./partial_conversation/partial_conversation_settings__GENERALIZED__VALUE_REGEX";

async function conversation_settings_swapTokenToCoin_gas_fee_VALUE_REGEX(
    conversation: BotConversation,
    ctx: any
) {
    const callbackData = await getCallbackData(ctx);

    const { userSessionDataPropertyName, userSessionDataPropertyName_VALUE } =
        await getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData(
            callbackData,
            "cb_settings_"
        );

    const coinInformation = await getBotShared().getCoinInformation();

    const message_ask = `Please enter a Gas Fee Amount in ${coinInformation.ticker} for Sell Gas Fee Amount Position (${userSessionDataPropertyName_VALUE}):`;

    async function getMessageResultInvalid(result: string) {
        return `Invalid Gas Fee Amount for Sell Gas Fee Amount Position (${userSessionDataPropertyName_VALUE}).`;
    }

    async function getMessageDone(result: string) {
        return `Sell Gas Fee Amount Position (${userSessionDataPropertyName_VALUE}) set to ${result}.`;
    }

    await partial_conversation_settings__GENERALIZED__VALUE_REGEX<number>(
        conversation,
        ctx,
        message_ask,
        formatAndValidateInput_number_greater_than_or_equal_to_0,
        getMessageResultInvalid,
        getMessageDone
    );
}

bot.use(
    createConversation(
        conversation_settings_swapTokenToCoin_gas_fee_VALUE_REGEX,
        "conversation_settings_swapTokenToCoin_gas_fee_VALUE_REGEX"
    )
);

async function cb_settings_swapTokenToCoin_gas_fee_VALUE_REGEX(
    ctx: BotContext
) {
    await ctx.conversation.enter(
        "conversation_settings_swapTokenToCoin_gas_fee_VALUE_REGEX"
    );
    await ctx.answerCallbackQuery();
}
bot.callbackQuery(
    /cb_settings_swapTokenToCoin_gas_fee_VALUE_([^\s]+)/,
    cb_settings_swapTokenToCoin_gas_fee_VALUE_REGEX
);
