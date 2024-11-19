import { createConversation } from "@grammyjs/conversations";
import bot from "../bot_init";
import getBotShared from "../defined/BotShared";
import { BotContext, BotConversation } from "../utils/util_bot";
import { partial_conversation_swapTokenToCoin_amount_percent_VALUE_REGEX } from "./partial_conversation/partial_conversation__GENERALIZED__VALUE_REGEX";
import { swapTokenToCoin } from "./swapTokenToCoin";
import {
    getCallbackData,
    getGrammyUser,
    getTokenAddress,
    getUserSettings,
} from "./utils/common";
import {
    getUserSessionDataPropertyNameAndVALUEFromCallbackData,
    getUserSessionDataPropertyValueFromCTX,
} from "./utils/util";

// // Function to fetch sell percent by button ID
// async function fetchSellPercentByButtonId(ctx: BotContext): Promise<number> {
//     // const prisma = getDatabaseClientPrismaSingleton();

//     // const settings = await prisma.settings.findUnique({
//     //     where: {
//     //         userId: userId,
//     //     },
//     // });

//     // if (!settings) {
//     //     throw new Error("User settings not found");
//     // }

//     // switch (buttonId) {
//     //     case "cb_swapTokenToCoin_amount_percent_VALUE_1":
//     //         return settings.sellLeftPercentX;
//     //     case "cb_swapTokenToCoin_amount_percent_VALUE_2":
//     //         return settings.sellRightPercentX;
//     //     default:
//     //         throw new Error("Invalid button ID");
//     // }

//     switch (ctx.callbackQuery?.data) {
//         case "cb_swapTokenToCoin_amount_percent_VALUE_1":
//             return ctx.session.swapTokenToCoin_amount_percent_1;
//         case "cb_swapTokenToCoin_amount_percent_VALUE_2":
//             return ctx.session.swapTokenToCoin_amount_percent_2;
//         default:
//             throw new Error("Invalid button ID");
//     }
// }

export async function conversation_swapTokenToCoin_amount_percent_VALUE_REGEX(
    conversation: BotConversation,
    ctx: BotContext
) {
    const [callbackData, tokenAddress, grammyUser] = await Promise.all([
        getCallbackData(ctx),
        getTokenAddress(ctx),
        getGrammyUser(ctx),
    ]);

    const userSessionDataProperty_data =
        await getUserSessionDataPropertyNameAndVALUEFromCallbackData(
            callbackData,
            "cb_"
        );

    // const userId = ctx.update.callback_query?.from.id;
    const grammyUserId = grammyUser.id;

    const tokenInformation = await getBotShared()
        .getTokenClient()
        .getTokenInformation(tokenAddress);

    const userSettings = await getUserSettings(grammyUserId);

    if (callbackData === "cb_swapTokenToCoin_amount_percent_VALUE_custom") {
        const result =
            await partial_conversation_swapTokenToCoin_amount_percent_VALUE_REGEX(
                conversation,
                ctx,
                userSessionDataProperty_data
            );

        ctx = result.ctx;

        if (result.isResultValid) {
            ctx.session.swapTokenToCoin_amount_percent_selected =
                ctx.session.swapTokenToCoin_amount_percent_custom;

            ctx.temp.shouldEditCurrentCTXMessage = true; // Already assigned to partial_conversation_swapTokenToCoin_amount_percent_VALUE_REGEX
            ctx.temp.conversationMethodReturnedANewCTX = true; // Already assigned to partial_conversation_swapTokenToCoin_amount_percent_VALUE_REGEX
        }
    } else {
        const amountPercent =
            await getUserSessionDataPropertyValueFromCTX<number>(ctx);

        ctx.session.swapTokenToCoin_amount_percent_selected = amountPercent;

        ctx.temp.shouldEditCurrentCTXMessage = true;
    }
    await swapTokenToCoin.swapTokenToCoin(ctx);
}

bot.use(
    createConversation(
        conversation_swapTokenToCoin_amount_percent_VALUE_REGEX,
        "conversation_swapTokenToCoin_amount_percent_VALUE_REGEX"
    )
);

async function cb_swapTokenToCoin_amount_percent_VALUE_REGEX(ctx: BotContext) {
    // await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    // await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    // await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await ctx.conversation.enter(
        "conversation_swapTokenToCoin_amount_percent_VALUE_REGEX"
    );
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapTokenToCoin_amount_percent_VALUE_([^\s]+)/,
    cb_swapTokenToCoin_amount_percent_VALUE_REGEX
);
