import { conversations } from "@grammyjs/conversations";
import { Bot, CallbackQueryMiddleware, Composer, session } from "grammy";
import config from "../config/config";

import { CallbackQueryContext, MaybeArray } from "grammy/out/context";
import { BotContext } from "../utils";
import middleware_debugger from "./middleware/_middleware_debugger";

const bot = new Bot<BotContext>(config.getTgBotToken());


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
