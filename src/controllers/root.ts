import { CommandContext, Context } from "grammy";
import { ParseMode } from "grammy/types";
import { PrismaClient } from "@prisma/client";
import { UserClient } from "../clients/user";
import { BotContext } from "../utils";
import { TronClient } from "../clients/tron";

export const start = async (ctx: BotContext) => {
  const id = ctx?.from?.id;

  if (!id) {
    throw Error("No user ID");
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
            { text: "Buy", callback_data: "callback_buy" },
            { text: "Sell / Manage", callback_data: "callback_tokens_owned" },
          ],
          [{ text: "Settings", callback_data: "callback_settings" }],
          [
            { text: "Help", callback_data: "callback_help" },
            { text: "Refresh", callback_data: "callback_refresh" },
          ],
        ],
      },
    }
  );
};

export const help = async (ctx: CommandContext<Context>) => {
  await ctx.reply(`lorem help`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Close", callback_data: "cancel_cb" }]],
    },
  });
};

export const chat = async (ctx: CommandContext<Context>) => {
  await ctx.reply(`CHAT`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Close", callback_data: "cancel_cb" }]],
    },
  });
};
