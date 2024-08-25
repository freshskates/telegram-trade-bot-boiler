import { CommandContext, Context } from "grammy";
import { ParseMode } from "grammy/types";
import { PrismaClient } from "@prisma/client";
import { UserClient } from "../clients/user";

export const start = async (ctx: CommandContext<Context>) => {
  const id = ctx.message?.from.id;

  if (!id) {
    throw Error("No user ID");
  }

  if (!id) {
    throw Error("No user ID found");
  }

  const wallet = "TFkv5u8XTsZUqG2QDMjziCLQSGM5weSw8z";
  const balance = 0;

  await ctx.reply(
    `
**Welcome to Electron**  
Tron's fastest bot to trade any coin\\!
    
${
  // @ts-ignore
  balance === 0 // show bal in trx ?usdt?
    ? "You currently have no TRX in your wallet. Deposit TRX to your Tron wallet address:\n\n"
    : ``
} 
\`${wallet}\` (tap to copy)
    
Once done, tap refresh, and your balance will appear here.
    
To buy a token, enter the token address or a URL from [sunpump](https://sunpump.meme/) or [sun.io](https://sun.io/).
    
💡 If you aren't already, we advise that you use any of the following bots to trade with. You will have the same wallets and settings across all bots, but it will be significantly faster due to lighter user load.
    
[Achilles](https://t.me/achilles_trojanbot) | [Odysseus](https://t.me/odysseus_trojanbot) | [Menelaus](https://t.me/menelaus_trojanbot) | [Diomedes](https://t.me/diomedes_trojanbot) 
`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Buy", callback_data: "buy" },
            {
              text: "Sell",
              callback_data: "sell",
            },
          ],
          [{ text: "Positions", callback_data: "positions" }],
          [
            { text: "Referrals", callback_data: "referrals" },
            { text: "Settings", callback_data: "settings" },
          ],
          [
            { text: "Help", callback_data: "help" },
            { text: "Refresh", callback_data: "refresh" },
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
