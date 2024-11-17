import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import getBotShared from "../../defined/BotShared";
import {
    NoAuthorError,
    NoCallbackDataError,
    NoTokenAddressError,
} from "../../utils/error";
import { BotContext, BotConversation } from "../../utils/util_bot";
import { getUserSessionDataPropertyValueFromCTX } from "../utils/util";
import { swapTokenToCoin } from "./swapTokenToCoin";

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
    const tokenAdress = ctx.session.tokenAddress_selected;

    if (!tokenAdress) {
        throw new NoTokenAddressError(`${tokenAdress}`);
    }

    const callbackData = ctx.callbackQuery?.data;

    if (!callbackData) {
        throw new NoCallbackDataError(`${callbackData}`);
    }

    // const userId = ctx.update.callback_query?.from.id;
    const userId = ctx.from?.id;

    if (!userId) {
        throw new NoAuthorError(`${userId}`);
    }

    if (callbackData === "cb_swapTokenToCoin_amount_percent_VALUE_custom") {
        await ctx.reply("Please enter the percent of TRX you wish to sell:");

        ctx = await conversation.wait();
        const { message } = ctx;

        const customAmountPercent = parseFloat(message?.text || "0");

        if (
            isNaN(customAmountPercent) ||
            customAmountPercent < 0 ||
            customAmountPercent > 100
        ) {
            await ctx.reply(
                "Invalid percent. Valid value must be between 1 and 100."
            );
            await swapTokenToCoin.swapTokenToCoin(ctx);
            return 
            // TODO: MAYBE RE-ENTER CONVERSATION AND ASK AGAIN?

        }

        const tokenInformation = await getBotShared()
            .getTokenClient()
            .getTokenInformation(tokenAdress);

        await ctx.reply(
            `You have selected to sell ${customAmountPercent}% of your ${tokenInformation.token.symbol}.`
        );

        ctx.session.swapTokenToCoin_amount_percent_custom = customAmountPercent;
        ctx.session.swapTokenToCoin_amount_percent_selected =
            customAmountPercent;

        ctx.temp.shouldEditCurrentCTXMessage = true;
        ctx.temp.conversationMethodReturnedANewCTX = true;
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
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    // await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await ctx.conversation.enter(
        "conversation_swapTokenToCoin_amount_percent_VALUE_REGEX"
    );
    await ctx.answerCallbackQuery();
}

bot.callbackQuery(
    /cb_swapTokenToCoin_amount_percent_VALUE_([^\s]+)/,
    cb_swapTokenToCoin_amount_percent_VALUE_REGEX
);
