import { NextFunction } from "grammy";
import bot from "../../bot_init";
import getBotShared from "../../defined/BotShared";
import { BotContext } from "../../utils/util_bot";

async function command_root_home_(ctx: BotContext, next: NextFunction | null = null) {
    const user_id = ctx?.from?.id;

    if (!user_id) {
        throw Error("No user ID"); // TODO: DO PROPER LOGGING
    }

    console.log("Printing ctx.user.user", ctx.user.user);
    console.log("Printing ctx", ctx);

    const walletPublicKey = ctx.user.user.walletPublicKey;

    const walletBalance = await getBotShared()
        .getCoinClient()
        .getCoinWalletBalance(walletPublicKey);

    await ctx.reply(
        `
*Welcome to Electron* | *Monad's fastest bot to trade!*

${
    // @ts-ignore
    walletBalance.coinBalance == 0 // show bal in trx ?usdt?
        ? "You currently have no MONAD in your wallet. Deposit MONAD to your Monad wallet address:\n"
        : `*Balance: ${walletBalance.coinBalance} MONAD*\n`
} 
\`${walletPublicKey}\` (tap to copy)

Once done, tap refresh, and your balance will appear here.
`,
        {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Buy",
                            callback_data: "cb_swapCoinToToken",
                        },
                        {
                            text: "Manage → Sell",
                            callback_data: "cb_tokensOwned",
                        },
                    ],
                    [
                        {
                            text: "Settings",
                            callback_data: "cb_settings",
                        },
                    ],
                    [
                        {
                            text: "Help",
                            callback_data: "cb_root_help",
                        },
                        {
                            text: "Refresh",
                            callback_data: "cb_root_refresh",
                        },
                    ],
                ],
            },
        }
    );
}

async function command_root_home(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior

    await command_root_home_(ctx);
}
bot.command("start", command_root_home);


bot.callbackQuery("cb_root_home", cb_root_refresh);

async function cb_root_refresh(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior
    await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior
    
    await command_root_home_(ctx);
    await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_root_refresh", cb_root_refresh);


// // FIXME: NOT USED // TODO: IDK FUCK
async function help(ctx: BotContext, next: NextFunction | null = null) {
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior

    console.log("FROM HELP");
    console.log(ctx);

    await ctx.reply(`lorem help`, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Close",
                        callback_data: "cb_cancel",
                    },
                ],
            ],
        },
    });
    ctx.answerCallbackQuery();
}
bot.command("help", help);

// const chat = async (ctx: BotContext, next: NextFunction | null = null) => {
//     await ctx.reply(`CHAT`, {
//         parse_mode: "HTML",
//         reply_markup: {
//             inline_keyboard: [
//                 [
//                     {
//                         text: "Close",
//                         callback_data: "cb_cancel",
//                     },
//                 ],
//             ],
//         },
//     });
// };


const Root = {
    cb_root: command_root_home_,
};
export default Root;
