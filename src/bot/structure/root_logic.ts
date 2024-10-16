import { CommandContext, Context, NextFunction } from "grammy";
import { TronClient } from "../../clients/tron";
import { BotContext } from "../../utils";



async function start(ctx: BotContext, next: NextFunction | null = null) {
    const user_id = ctx?.from?.id;

    if (!user_id) {
        throw Error("No user ID"); // TODO: DO PROPER LOGGING
    }

    const wallet = ctx.session.user.walletPb;

    const tronClient = new TronClient();

    const balance = await tronClient.checkBalance(wallet);

    await ctx.reply(
        `
*Welcome to Electron*  
Tron's fastest bot to trade any coin!

${
// @ts-ignore
balance == 0 // show bal in trx ?usdt?
    ? "You currently have no TRX in your wallet. Deposit TRX to your Tron wallet address:\n"
    : `*Balance: ${balance} TRX*\n`
} 
\`${wallet}\` (tap to copy)

Once done, tap refresh, and your balance will appear here.

💡 If you aren't already, we advise that you use any of the following bots to trade with. You will have the same wallets and settings across all bots, but it will be significantly faster due to lighter user load.

[Achilles](https://t.me/achilles_trojanbot) | [Odysseus](https://t.me/odysseus_trojanbot) | [Menelaus](https://t.me/menelaus_trojanbot) | [Diomedes](https://t.me/diomedes_trojanbot) 
`,
        {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Buy",
                            callback_data: "callback__main__buy",
                        },
                        {
                            text: "Sell / Manage",
                            callback_data: "callback_tokens_owned",
                        },
                    ],
                    [
                        {
                            text: "Settings",
                            callback_data: "callback__main__settings",
                        },
                    ],
                    [
                        {
                            text: "Help",
                            callback_data: "callback__main__help",
                        },
                        {
                            text: "Refresh",
                            callback_data: "callback_refresh",
                        },
                    ],
                ],
            },
        }
    );
};

const help = async (ctx: CommandContext<Context>) => {
    await ctx.reply(`lorem help`, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Close",
                        callback_data: "callback__main__cancel",
                    },
                ],
            ],
        },
    });
};

const chat = async (ctx: CommandContext<Context>) => {
    await ctx.reply(`CHAT`, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Close",
                        callback_data: "callback__main__cancel",
                    },
                ],
            ],
        },
    });
};


const RootLogic = {
    start: start,
    help: help,
    chat: chat,
}

export {RootLogic}