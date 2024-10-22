import { CommandContext, Context, NextFunction } from "grammy";
import { MonadClient } from "../../clients/monad";
import { BotContext } from "../../utils";
import bot from "../bot_init";

async function start(ctx: BotContext, next: NextFunction | null = null) {
  const user_id = ctx?.from?.id;

  if (!user_id) {
    throw Error("No user ID"); // TODO: DO PROPER LOGGING
  }

  console.log(ctx.session.user, "uiser");
  const wallet = ctx.session.user.walletPb;

  const balance = await MonadClient.checkMonadBalance(wallet);

  await ctx.reply(
    `
*Welcome to Electron* | *Monad's fastest bot to trade!*

${
  // @ts-ignore
  balance.monadBalance == 0 // show bal in trx ?usdt?
    ? "You currently have no MONAD in your wallet. Deposit MONAD to your Monad wallet address:\n"
    : `*Balance: ${balance.monadBalance} MONAD*\n`
} 
\`${wallet}\` (tap to copy)

Once done, tap refresh, and your balance will appear here.
`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Buy",
              callback_data: "cb_buy",
            },
            {
              text: "Sell / Manage",
              callback_data: "cb_tokens_owned",
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
              callback_data: "cb_help",
            },
            {
              text: "Refresh",
              callback_data: "cb_refresh",
            },
          ],
        ],
      },
    }
  );
}

async function help(ctx: BotContext, next: NextFunction | null = null) {
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

bot.callbackQuery("cb_refresh", async (ctx) => {
  await start(ctx);
  await ctx.answerCallbackQuery();
});

const RootLogic = {
  start: start,
  help: help,
  chat: chat,
};

export { RootLogic };
