import { Bot, CallbackQueryMiddleware, Composer } from "grammy";
import config from "../config/config";

import { CallbackQueryContext, MaybeArray } from "grammy/out/context";
import { BotContext } from "../utils";

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
