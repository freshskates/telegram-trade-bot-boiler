import { conversations } from "@grammyjs/conversations";
import {
    Bot,
    CallbackQueryMiddleware,
    Composer,
    session
} from "grammy";
import config from "../config/config";

import { CallbackQueryContext, MaybeArray } from "grammy/out/context";
import { BotContext } from "../utils";
import middlewareDebugger from "./middleware/_middlewareDebug";

const bot = new Bot<BotContext>(config.getTgBotToken());

/* 
**************************************************
Important Middleware
**************************************************
*/

// Debugging Middleware
bot.use(middlewareDebugger);

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
