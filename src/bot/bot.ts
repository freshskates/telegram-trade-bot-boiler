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

    In order to bypass this problem, you need
    

*/
import { conversations, createConversation } from "@grammyjs/conversations";
import { PrismaAdapter } from "@grammyjs/storage-prisma";
import ansiColors from "ansi-colors";
import {
    Enhance,
    enhanceStorage,
    GrammyError,
    HttpError,
    lazySession,
    NextFunction,
    session,
} from "grammy";
import path from "path";
import url from "url";
import getPrismaClientSingleton from "../services/prisma_client_singleton";
import {
    BotContext,
    BotConversation,
    GetNewInitialSessionData,
    UserSessionData,
} from "../utils";
import auto_load_modules_from from "./auto_load_module";
import bot from "./bot_init";
import middleware_debugger from "./middleware/_middleware_debugger";
import { middlewareAddTempDataToCTX } from "./middleware/middlewareAddTempDataToCTX";
import { middlewareAddUserDataToCTX } from "./middleware/middlewareAddUserDataToCTX";

// TODO: refresh_cb?
// TODO: referrals_cb?
// TODO: positions_cb?

/**
 * This function was made to prevent typescript from complaining about Top-level 'await' expressions
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
                grammyjs Prisma session

            Reference:
                https://github.com/grammyjs/storages/tree/main/packages/prisma
                https://www.npmjs.com/package/@grammyjs/storage-prisma

        Initial Session Data 
        
            Date Today:
                10/30/2024
            Notes:
                Details on how to make a session the correct way.

            Reference:
                https://grammy.dev/plugins/session#initial-session-data
        
        Lazy Sessions 
        
            Date Today:
                10/31/2024
            Notes:
                Way to reduce DB read and writes.
                Apparently, it only works in middleware.


                lazySession (Reference: https://grammy.dev/ref/core/lazysession)
                    Basically, we use lazySession(...) instead of session(...) to minimize read/writes to the db

            Reference:
                https://grammy.dev/plugins/session#lazy-sessions
    
    */
    bot.use(
        // Session middleware provides a persistent data storage for your bot.
        session({
        // lazySession({ // Uncomment this line and comment out "session({"" if you want Lazy Sessions
            // initial option in the configuration object, which correctly initializes session objects for new chats.
            initial() {
                return GetNewInitialSessionData(); // return empty object (The object created here must always be a new object and not referenced outside this function otherwise you might share data )
            },

            // storage: new PrismaAdapter<SessionData>(getPrismaClientSingleton().session),  // Original version
            storage: enhanceStorage({
                storage: new PrismaAdapter<Enhance<UserSessionData>>(
                    getPrismaClientSingleton().session
                ),
                // migrations: getSessionMigration()
            }),
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
        The primary purpose of auto_load_modules_from(...) is to automatically execute bot.callbackQuery(...) 
        functions and functions similar to it from other files without those functions
        being explicitly executed in this file.

        The reason why auto_load_modules_from(...) is executed here is to prevent this file from being
        bloated with a bunch of bot function/method`calls.

        The benefits of having auto_load_modules_from(...):
            1. This file won't get bloated
            2. You can register bot functionality where the functionality is defined.
                e.g 
                    async function cb_foo(...){
                        ...
                    }
                    bot.callbackQuery("cb_foo", cb_foo) 
            
        The downsides of having auto_load_modules_from(...):
            1. There is no direct tracking on how the variable "bot" is being used by the files imported
               from auto_load_modules_from(...)
            
    ****************************************************************************************************
    */

    //@ts-ignore
    const PATH_FILE_THIS_FILE = url.fileURLToPath(import.meta.url);
    const PATH_DIRECTORY_THIS_FILE = path.dirname(PATH_FILE_THIS_FILE);
    const PATH_DIRECTORY_CONTROLLERS = path.join(
        PATH_DIRECTORY_THIS_FILE,
        // "controllers/manage/"
    );
    await auto_load_modules_from(PATH_DIRECTORY_CONTROLLERS, [
        PATH_FILE_THIS_FILE,
    ]);

    /* 
    ****************************************************************************************************
    Late Imports
    Notes:
        If you have code that uses the variable bot before any bot functionality has been
        registered, such as bot middleware, then you want to import here.
    ****************************************************************************************************
    */

    // const module_root_logic = await import("./structure/root_logic");
    // const module_router_root = await import("./structure/root_router");

    // const module_FUCKING_TEST = await import("../abi/FUCKING_TEST_FILE");
    // bot.on("message:text", module_FUCKING_TEST._TEST_FUNCTION);
    // bot.on("message:text", _TEST_FUNCTION);

    /* 
    ****************************************************************************************************
    Routes
    ****************************************************************************************************
    */

    // bot.use(module_router_root.default);

    /*
    ****************************************************************************************************
    ########## TESTING ZONE ##########

    IMPORTANT NOTES:
        1. Multi Sessions does not work Lazy Sessions (https://github.com/grammyjs/grammY/pull/216#issuecomment-1201078050)
        2. From testing, Conversations with Lazy Sessions will
            1. After the first bot.use(createConversation(...)) call every ctx.session will NOT BE A PROMISE which breaks the entire purpose of Lazy Sessions.
            2. Every (await ctx.session) must now be type checked if you want to access any variable or TypeScript will complain
        3. 
    ****************************************************************************************************
    */

    // Chat commands
    // bot.command("start", module_root_logic.RootLogic.start);
    // bot.command("help", module_root_logic.RootLogic.help);

    // bot.use(mainMenu);
    // bot.command("_test", (ctx) =>
    //     ctx.reply("Testing menu", { reply_markup: mainMenu })
    // );

    //////////////////////////////////////
    // bot.command("fuck", _TEST_FUNCTION);

    // bot.use(
    //     createConversation(
    //         async (conversation: BotConversation, ctx: BotContext) => {
    //             ctx.reply("FUCK DUDE");
    //             return;
    //         },
    //         "conversation_FUCK_ME"
    //     )
    // );

    // /////////////////////// Testing Lazy Session and it's interference bot.command(...) (Type in chat: /dude)
    // bot.command("dude", async (ctx: BotContext, next: NextFunction) => {
    //     // `promise` is a Promise of the session data, and
    //     console.log("FROM /dude");
    //     console.log("ctx.session  // THIS SHOULD BE A FUCKING PROMISE");
    //     console.log(ctx.session); // IF USING Lazy session AND THIS IS NOT A PROMISE, THEN SHIT IF FUCKED

    //     // `session` is the session data
    //     console.log("await ctx.session");
    //     console.log(await ctx.session);
    //     // await next();
    // });

    // /////////////////////// Testing bot.on(..., function)
    // async function _TEST_message_from_user(
    //     ctx: BotContext,
    //     next: NextFunction
    // ) {
    //     console.log("FROM message:text");
    //     console.log("- PRINTING ctx -");
    //     console.log(ctx);
    //     console.log("- PRINTING ctx.session -");
    //     console.log(ctx.session);

    //     //@ts-ignore
    //     ctx.reply(ctx.message.text);
    //     // await next()
    // }
    // bot.on("message:text", _TEST_message_from_user);

    /////////////////////// TESTING CALLBACKQUERY

    // bot.callbackQuery("cb_FUCK_YOU", async (ctx: BotContext) => {
    //     console.log("FROM cb_FUCK_YOU");
    //     console.log(ctx);
    //     console.log("ctx.session");
    //     console.log(ctx.session);
    //     // await start(ctx);
    //     await ctx.answerCallbackQuery();
    // });

    /////////////////////// ALTERNATIVE COMMAND TESTING (Importing this with the autoloader is will make ctx.session a promise)

    // bot.command("foo", async (ctx: BotContext) => {
    //     // `promise` is a Promise of the session data, and
    //     console.log("FROM /foo");
    //     console.log("ctx.session  // THIS SHOULD BE A FUCKING PROMISE");
    //     console.log(ctx.session); // IF USING Lazy session AND THIS IS NOT A PROMISE, THEN SHIT IF FUCKED

    //     // `session` is the session data
    //     console.log("await ctx.session");
    //     console.log(await ctx.session);
    // });

    ////////////////////// CONVERSATION TESTING, bot.use(createConversation(...)) TEST
    // bot.use(createConversation(async ( conversation: BotConversation,
    //     ctx: BotContext) => {ctx.reply("FUCK DUDE")}, "conversation_FUCK_ME"));

    ////////////////////// IMPORT TESTING

    // bot.use(
    //     createConversation(
    //         conversation_tokenSwapBuy_amount,
    //         "conversation_tokenSwapBuy_amount"
    //     )
    // );

    // bot.use(mainMenu);
    // bot.command("_test", (ctx) =>
    //     ctx.reply("Testing menu", { reply_markup: mainMenu })
    // );
    /*
    ****************************************************************************************************
    Special Handlers
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
                ansiColors.bgRed("Warning: callback_query not handled:"),
                ctx.callbackQuery.data
            );
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

export async function start_bot() {
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









////////////////////////////// BELOW IS TESTING WHY THE FUCK Lazy Session IS BREAKING ctx.session //////////////////////////////
////////////////////////////// It's breaking because it does not work with ConversationFlavor.
////////////////////////////// What i mean by breaking is that they both use ctx.session as a promise which mean you need to
////////////////////////////// check if "await ctx.session" is a YourCustomSessionDataType type or a ConversationSessionData
//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////
//////////////////////////////

// // // export default start_bot;
// import { PrismaAdapter } from '@grammyjs/storage-prisma'
// import { Bot, Context, Enhance, enhanceStorage, lazySession, LazySessionFlavor, session, SessionFlavor } from 'grammy'
// import getPrismaClientSingleton from '../services/prisma_client_singleton'
// import { ConversationFlavor, conversations, ConversationSessionData } from '@grammyjs/conversations'

// // This bot will count how many photos are sent in the chat. The counter can be
// // retrieved with the `/stats` command.

// // This is the data that will be saved per chat.
// interface SessionDataTest {
//     photoCount: number
//     // foo: {}
//     // fuck_you: {}
// }

// // flavor the context type to include sessions
// type MyContext = 
// Context & 
// // SessionFlavor<(SessionDataTest)> & 
// // LazySessionFlavor<(SessionDataTest)> & ConversationFlavor
// LazySessionFlavor<(SessionDataTest& ConversationSessionData)> & ConversationFlavor 



// // Create a bot
// const bot = new Bot<MyContext>('') // <-- place your token inside this string

// // Note that using `lazySession()` will only save the data in-memory. If the
// // Node.js process terminates, all data will be lost. A bot running in production
// // will need some sort of database or file storage to persist data between
// // restarts. Confer the grammY documentation to find out how to store data with
// // your bot.

// bot.use(
//     // session({
//     lazySession({
//     initial: () => ({ photoCount: 0 }),
//     storage: enhanceStorage({
//         storage: new PrismaAdapter<Enhance<SessionDataTest>>(
//             getPrismaClientSingleton().session
//         ),
//         // migrations: getSessionMigration()
//     }),
// }))


// // ------------- THE BELOW IS A TEST ON MULTI SESSION IN GENERAL TO SEE THE POSSIBLE CONFLICTS (Multi Session + Session migration + Conversations)
// // bot.use(
// //     session({
// //     type: "multi",
// //     foo: {
// //       // these are also the default values
// //       storage: new MemorySessionStorage(),
// //       initial: () => ({}),
// //     //   getSessionKey: (ctx) => ctx.chat?.id.toString(),
// //     },
// //     fuck_you:{
// //         initial: () => ({ photoCount: 0 }),
// //         storage: enhanceStorage({
// //             storage: new PrismaAdapter<Enhance<SessionDataTest>>(
// //                 getPrismaClientSingleton().session
// //             ),
// //             // migrations: getSessionMigration()
// //         })
// //     }

// // }))
// bot.use(conversations());


// function isSessionData(object: any): object is SessionDataTest{
//     return 'photoCount' in object
// }

// // Collect statistics
// bot.on('message:photo', async (ctx, next) => {

//     // NO LAZY SESSSION, THEN TYPE IS: ConversationSessionData | (SessionDataTest & ConversationSessionData)
//     // LAZY SESSION, THEN TYPE IS: SessionDataTest | ConversationSessionData | (SessionDataTest & ConversationSessionData)
//     const stats = await ctx.session

    
//     // NO LAZY SESSION THEN TYPE IS: SessionDataTest & MaybePromise<ConversationSessionData>
//     // LAZY SESSION TYPE IS: (SessionDataTest & ConversationSessionData) | (Promise<SessionDataTest> & ConversationSessionData) | (SessionDataTest & Promise<...>) | (Promise<...> & Promise<...>)
//     let x = ctx.session

//     if (isSessionData(stats)){

//         stats.photoCount++
//     }



//     stats.photoCount++
//     await next()
// })

// bot.filter(ctx => ctx.chat?.type === 'private').command('start', ctx =>
//     ctx.reply(
//         'Hi there! I will count the photos in this chat so you can get your /stats!'
//     )
// )

// bot.on(':new_chat_members:me', ctx =>
//     ctx.reply(
//         'Hi everyone! I will count the photos in this chat so you can get your /stats!'
//     )
// )

// // Send statistics upon `/stats`
// bot.command('stats', async ctx => {
//     const poop = ctx.session
//     const stats = await ctx.session

//     // Format stats to string
//     const message = `You sent <b>${stats.photoCount} photos</b> since I'm here!`

//     // Send message in same chat using `reply` shortcut. Don't forget to `await`!
//     await ctx.reply(message, { parse_mode: 'HTML' })
// })

// // Catch errors and log them
// bot.catch(err => console.error(err))

// // Start bot!
// bot.start()

