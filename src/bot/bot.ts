import { GrammyError, HttpError, session } from "grammy";
import path from "path";
import { fileURLToPath } from "url";
import { BotContext } from "../utils";
import mainMenu from "./_test";
import auto_load_modules_from from "./auto_load_module";
import bot from "./bot_init";
import { middlewareAddUserDataToCTX } from "./middleware/middlewareAddUserDataToCTX";
import routerRoot from "./structure/root_router";
import middleware_debugger from "./middleware/_middleware_debugger";
import { conversations } from "@grammyjs/conversations";

// TODO: refresh_cb?
// TODO: referrals_cb?
// TODO: positions_cb?


/**
 * This function was made to prevent typescirpt from complaining about Top-level 'await' expressions
 *
 * @async
 * @returns {*}
 */
async function main(){
    /* 
    ****************************************************************************************************
    Middleware
    ****************************************************************************************************
    */

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
    
    // Append user to CTX (Context) Middleware
    bot.use(middlewareAddUserDataToCTX());

    // Debugging Middleware
    bot.use(middleware_debugger);

    /* 
    ****************************************************************************************************
    Load all possible js/ts files relative to this file's directory

    Notes:
        The primary purpose is to automatically call
        bot.callbackQuery(...) from other files without
        those calls being explicitly called within this file.
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
    // bot.command("start", RootLogic.start);
    // bot.command("help", RootLogic.help);

    bot.use(routerRoot);

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
