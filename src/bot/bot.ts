/*
#################### WARNING: READ ME BEFORE MODIFYING THIS FILE ####################
    Make sure that every module imported/required in this file except for bot from the file "./bot_init"
    must not contain any bot function/method such as
        bot.callbackQuery(...)
        bot.createConversation(...)
        etc.
    
    being executed immediately. 
    The above statement also applies to the modules imported/required from the modules imported in this file. 

    Bot function/method calls executed BEFORE this file will potentially lead to unfavorable
    behavior because those executed function/method calls will execute before any of this
    file's bot function/method calls execute. This means that some intended logic 
    will happen out of order. For example, middleware might not run at all because a bot.callbackQuery(...)
    call was executed before middleware was registered to the bot.
    

*/
import { conversations } from "@grammyjs/conversations";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import ansiColors from "ansi-colors";
import { GrammyError, HttpError, session } from "grammy";
import path from "path";
import { fileURLToPath } from "url";
import getPrismaClientSingleton from "../services/prisma_client_singleton";
import { BotContext, GetNewInitialSessionData, SessionData } from "../utils";
import mainMenu from "./_test";
import auto_load_modules_from from "./auto_load_module";
import bot from "./bot_init";
import middleware_debugger from "./middleware/_middleware_debugger";
import { middlewareAddTempDataToCTX } from "./middleware/middlewareAddTempDataToCTX";
import { middlewareAddUserDataToCTX } from "./middleware/middlewareAddUserDataToCTX";
import { RootLogic } from "./structure/root_logic";

// TODO: refresh_cb?
// TODO: referrals_cb?
// TODO: positions_cb?

/**
 * This function was made to prevent typescirpt from complaining about Top-level 'await' expressions
 *
 * @async
 * @returns {*}
 */
async function main() {
    /* 
    ****************************************************************************************************
    Middleware
    ****************************************************************************************************
    */

    /*
    Session Middleware

    Reference:
        Initial Session Data 
        
            Date Today:
                10/25/2024
            Notes:
                Proper way of adding session
            Reference:
                https://grammy.dev/plugins/session#initial-session-data

        grammyjs Prisma example
        
            Date Today:
                10/26/2024
            Notes:
                
            Reference:
                https://github.com/grammyjs/storages/tree/main/packages/prisma
                https://www.npmjs.com/package/@grammyjs/storage-prisma
    */
    bot.use(
        // Session middleware provides a persistent data storage for your bot.
        session({
            // initial option in the configuration object, which correctly initializes session objects for new chats.
            initial() {
                return GetNewInitialSessionData(); // return empty object (The object created here must always be a new object and not referenced outside this function otherwise you might share data )
            },
            storage: new PrismaAdapter<SessionData>(
                getPrismaClientSingleton().session
            ),
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

    // Append user to CTX (Context) Middleware
    bot.use(middlewareAddUserDataToCTX());

    bot.use(middlewareAddTempDataToCTX());

    // Debugging Middleware
    bot.use(middleware_debugger);

    /* 
    ****************************************************************************************************
    Load all possible js/ts files relative to this file's directory

    Notes:
        The primary purpose of auto_load_modules_from(...) is to automatically call bot.callbackQuery(...) 
        functions and functions similar to it from other files without those functions
        being explicitly executed in this file.

        The reason why auto_load_modules_from(...) is executed here is to prevent this file from being
        bloated with a bunch of bot function calls.
    ****************************************************************************************************
    */

    //@ts-ignore
    const PATH_FILE_THIS_FILE = fileURLToPath(import.meta.url);
    const PATH_DIRECTORY_THIS_FILE = path.dirname(PATH_FILE_THIS_FILE);
    await auto_load_modules_from(PATH_DIRECTORY_THIS_FILE, [
        PATH_FILE_THIS_FILE,
    ]);

    /* 
    ****************************************************************************************************
    Routes
    ****************************************************************************************************
    */

    // Chat commands
    bot.command("start", RootLogic.start);
    bot.command("help", RootLogic.help);

    // ------- FOR TESTING -------
    // bot.on('message:text', ctx => {
    //     console.log("message:text");
    //     console.log(ctx);

    //     ctx.reply(ctx.message.text)

    // })

    // bot.use(routerRoot);

    /////////////////////////////// PAST THIS POINT IS SOME OTHER SHIT LIKE TESTING

    bot.use(mainMenu);
    bot.command("_test", (ctx) =>
        ctx.reply("Testing menu", { reply_markup: mainMenu })
    );

    /*
     ****************************************************************************************************
     ****************************************************************************************************
     */

    /* 
    Catching callbackQuery callback_query that is not handled

    Notes:
        Basically, you didn't handle the callbackQuery registered name (trigger name) 

        Look at "Answering All Callback Queries" as it's the refernece for the below code

    Refernece:
        https://grammy.dev/plugins/keyboard#responding-to-inline-keyboard-clicks
    */
    bot.on("callback_query:data", async (ctx: BotContext) => {
        if (!ctx.callbackQuery) {
            console.log(
                ansiColors.bgRed(
                    "Warning: Something went wrong with callback_query"
                )
            );
        } else {
            console.log(
                ansiColors.bgRed("Warning: callback_query not handled:")
            );
            console.log(ctx.callbackQuery.data);
        }
        console.log(ctx);

        console.log(ansiColors.bgRed("End of Warning"));

        await ctx.answerCallbackQuery(); // remove loading animation
    });

    bot.catch((err) => {
        const ctx = err.ctx;
        console.error(`Error while handling update ${ctx.update.update_id}:`);
        const e = err.error;
        if (e instanceof GrammyError) {
            console.error("Error in request:", e.description);
        } else if (e instanceof HttpError) {
            console.error("Could not contact Telegram:", e);
        } else {
            console.error("Unknown error:", e);
        }
    });
}
async function start_bot() {
    await main();

    Promise.all([
        await bot.start({
            onStart(botInfo) {
                console.table(botInfo),
                    console.log(new Date(), "Bot is running.");
            },
        }),
    ]);
}

export default start_bot;
