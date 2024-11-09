import { Bot } from "grammy";
import config from "../config/config";

import { BotContext } from "./utils/bot_utility";

const bot = new Bot<BotContext>(config.getTelegramBotToken());

// ----- THE BELOW IS TESTING TO FIX A UNINTENDED BEHAVIOR, LEAVE HERE UNTIL RESOLVED -----
// declare global {
//     var bot: Bot<BotContext>;
//   }

//   function getBot(): Bot<BotContext> {

//     if (globalThis.prismaGlobal == null){
//         globalThis.bot = new Bot<BotContext>(config.getTgBotToken());
//     }

//     return globalThis.bot

//   }

// const bot = getBot()
/*
 **************************************************
 **************************************************
 */

// function botRegisterCallbackQuery(
//     trigger: MaybeArray<string | RegExp>,
//     ...middleware: Array<CallbackQueryMiddleware<BotContext>>
// ): Composer<CallbackQueryContext<BotContext>> {
//     return bot.callbackQuery(trigger, ...middleware);
// }

// const BotInitialized = {
//     bot: bot,
//     botRegisterCallbackQuery: botRegisterCallbackQuery,
// }

export default bot;
