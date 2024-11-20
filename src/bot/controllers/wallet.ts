import { NextFunction } from "grammy";
import getBotShared from "../defined/BotShared";
import { BotContext } from "../utils/util_bot";
import bot from "../bot_init";

async function cb_wallet_(ctx: BotContext, next: NextFunction | null = null) {
  const user_id = ctx?.from?.id;

  if (!user_id) {
    throw Error("No user ID"); // TODO: DO PROPER LOGGING
  }

  const walletPublicKey = ctx.user.user.walletPublicKey;

  const walletBalance = await getBotShared()
    .getCoinClient()
    .getCoinWalletBalance(walletPublicKey);

  await ctx.reply(
    `
  *Wallet Menu*
  
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
              text: "Export Private Key",
              callback_data: "empty",
            },
            {
              text: "Refresh",
              callback_data: "cb_wallet_refresh",
            },
          ],
          [
            {
              text: "Home",
              callback_data: "cb_root_home",
            },
          ],
        ],
      },
    }
  );
}

async function cb_wallet_refresh(ctx: BotContext) {
  await ctx.conversation.exit(); // Exit any exist conversation to prevent buggy behavior
  await ctx.deleteMessage(); // Delete the most recent message relative to where this method was called
  await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

  await cb_wallet_(ctx);
  await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_wallet_refresh", cb_wallet_refresh);

//
async function cb_wallet(ctx: BotContext) {
  await cb_wallet_(ctx);
  await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_wallet", cb_wallet);
