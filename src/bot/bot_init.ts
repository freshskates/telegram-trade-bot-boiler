import { conversations } from "@grammyjs/conversations";
import { Bot, CallbackQueryMiddleware, Composer, session } from "grammy";
import config from "../config/config";

import { CallbackQueryContext, MaybeArray } from "grammy/out/context";
import { BotContext } from "../utils";
import middleware_debugger from "./middleware/_middleware_debugger";

const bot = new Bot<BotContext>(config.getTgBotToken());

/* 
**************************************************
Important Middleware
**************************************************
*/

// Debugging Middleware
bot.use(middleware_debugger);

// Session Middleware
bot.use(
    // Session middleware provides a persistent data storage for your bot.
    session({
        // initial option in the configuration object, which correctly initializes session objects for new chats.
        initial() {
            return {}; // return empty object for now
        },
    })
);

/* 
Conversations Middleware

Notes:
    Install the conversations plugin.
      
    Reference:
        https://grammy.dev/plugins/conversations#installing-and-entering-a-conversation    

*/
bot.use(conversations()); // Note: External library stuff

/* 
Catching callbackQuery callback_query that is not handled

Notes:
    Look at "Answering All Callback Queries"

Refernece:
    https://grammy.dev/plugins/keyboard#responding-to-inline-keyboard-clicks
*/
bot.on("callback_query:data", async (ctx: BotContext) => {

    if (!ctx.callbackQuery) {
        console.log(
            "\x1b[31m%s\x1b[0m",
            "Warning: Something went wrong with callback_query"
        );
    } else {
        console.log(
            "\x1b[31m%s\x1b[0m",
            "Warning: callback_query not handled:",
            ctx.callbackQuery.data
        );
        // console.log("FUCK");
        // console.log(ctx.callbackQuery);
        // console.log("YOU");
        
    }
    console.log(ctx);
    
    console.log("\x1b[31m%s\x1b[0m", "End of Warning");

    await ctx.answerCallbackQuery(); // remove loading animation
});

/*
 **************************************************
 **************************************************
 */

function botRegisterCallbackQuery(
    trigger: MaybeArray<string | RegExp>,
    ...middleware: Array<CallbackQueryMiddleware<BotContext>>
): Composer<CallbackQueryContext<BotContext>> {
    return bot.callbackQuery(trigger, ...middleware);
}

// const BotInitialized = {
//     bot: bot,
//     botRegisterCallbackQuery: botRegisterCallbackQuery,
// }

export default bot;
