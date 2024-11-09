import { NextFunction } from "grammy";
import bot from "../../bot_init";
import { MonadCoinClient } from "../../defined/MonadCoinClient";
import { BotContext } from "../../utils/bot_utility";
import getBotSharedSingleton, { BotShared } from "../../defined/BotShared";

async function start(ctx: BotContext, next: NextFunction | null = null) {
    const user_id = ctx?.from?.id;

    if (!user_id) {
        throw Error("No user ID"); // TODO: DO PROPER LOGGING
    }

    console.log("Printing ctx.user.user", ctx.user.user);
    console.log("Printing ctx", ctx);

    const walletPublicKey = ctx.user.user.walletPublicKey;

    const walletBalance = await getBotSharedSingleton().getCoinClient().getCoinWalletBalance(walletPublicKey);

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
                            callback_data: "cb_root_swapCoinToToken",
                        },
                        {
                            text: "Sell / Manage",
                            callback_data: "cb_root_swapSellToken",
                        },
                    ],
                    [
                        {
                            text: "Settings",
                            callback_data: "cb_root_settings",
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

// // FIXME: NOT USED
async function help(ctx: BotContext, next: NextFunction | null = null) {
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

const chat = async (ctx: BotContext, next: NextFunction | null = null) => {
    await ctx.reply(`CHAT`, {
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
};

// bot.callbackQuery("cb_root_settings", async (ctx: BotContext) =>{
//   console.log("SDFSDFSDFSDF")
//   ctx.answerCallbackQuery()
// });

bot.callbackQuery("cb_root_refresh", async (ctx) => {
    console.log("FROM REFRESH");
    console.log(ctx);
    console.log("ctx.session");
    console.log(ctx.session);
    // await start(ctx);
    await ctx.answerCallbackQuery();
});

const RootLogic = {
    start: start,
    help: help,
    chat: chat,
};

export { RootLogic };

bot.command("start", RootLogic.start);
bot.command("help", RootLogic.help);
