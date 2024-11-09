// import { createConversation } from "@grammyjs/conversations";
// import { BotContext, BotConversation } from "../../../utils";
// import bot from "../../bot_init";

// export async function conversation_swapCoinToToken_amount(
//     conversation: BotConversation,
//     ctx: BotContext
// ) {
//     const callbackData = ctx.callbackQuery?.data;
//     const userId = ctx.update.callback_query?.from.id;

//     if (!userId) {
//         await ctx.reply("User ID not found.");
//         return;
//     }
// }

// /*
// **************************************************
// Buy Trx Conversation
// **************************************************
// */

// bot.use(
//     createConversation(
//         conversation_swapCoinToToken_amount,
//         "conversation_swapCoinToToken_amount"
//     )
// );

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

import bot from "../../bot_init";
import { BotContext } from "../../utils/bot_utility";

// export async function conversation_FUCK_ME(
//     conversation: BotConversation,
//     ctx: BotContext
// ) {
//     const callbackData = ctx.callbackQuery?.data;
//     const userId = ctx.update.callback_query?.from.id;

//     if (!userId) {
//         await ctx.reply("User ID not found.");
//         return;
//     }
// }

// bot.use(createConversation(async () => {}, "conversation_FUCK_ME"));

bot.command("foo", async (ctx: BotContext) => {
    // `promise` is a Promise of the session data, and
    console.log("FROM /foo");
    console.log("ctx.session  // THIS SHOULD BE A FUCKING PROMISE");
    console.log(ctx.session); // IF USING Lazy session AND THIS IS NOT A PROMISE, THEN SHIT IF FUCKED

    // `session` is the session data
    console.log("await ctx.session");
    console.log(await ctx.session);
});

bot.callbackQuery("cb_FUCK_YOU", async (ctx: BotContext) => {
    console.log("FROM cb_FUCK_YOU");
    console.log(ctx);
    console.log("ctx.session");
    console.log(ctx.session);
    // await start(ctx);
    await ctx.answerCallbackQuery();
});
