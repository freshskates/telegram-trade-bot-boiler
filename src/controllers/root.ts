import { CommandContext, Context } from "grammy";

export const start = async (ctx: CommandContext<Context>) => {
  const id = ctx.message?.from.id;
  const referral = ctx.message?.text?.replace("/start", "")?.trim();

  // if (!user) {
  // create user
  // }

  const wallet = "TFkv5u8XTsZUqG2QDMjziCLQSGM5weSw8z";
  const balance = 0;

  await ctx.reply(
    `
        <b>Welcome to Electron</b>
Trons fastest bot to trade any coin!
        \n${
          // @ts-ignore
          balance === 0
            ? "You currently have no TRX in your wallet. Deposit TRX to your Tron wallet address:\n\n"
            : ``
        } <code>${wallet}</code> (tap to copy)
         
Once done, tap refresh and your balance will appear here.

To buy a token enter token address, or a URL from sunpump (https://sunpump.meme/) or sun.io (https://sun.io/)

For more info on your wallet and to retrieve your private key, tap the wallet button below. User funds are safe on Electron, but if you expose your private key we can't protect you!

        `,
    {
      parse_mode: "HTML",

      reply_markup: {
        inline_keyboard: [
          [
            { text: "Wallet", callback_data: "wallet" },
            {
              text: "Split Token",
              callback_data: "split",
            },
          ],
          [
            { text: "Buy", callback_data: "buy" },
            { text: "Sell", callback_data: "sell" },
          ],

          [{ text: "Refresh", callback_data: "refresh" }],
        ],
      },
    }
  );
};

export const settings = async (ctx: CommandContext<Context>) => {
  const id = ctx.message?.from.id;

  let user = {};

  if (!user) {
    // const newWallet = TronClient.createWallet();
  }

  //@ts-ignore
  await ctx.reply(...settingsContent(user));
};

export const help = async (ctx: CommandContext<Context>) => {
  await ctx.reply(`lorem help`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Close", callback_data: "cancel" }]],
    },
  });
};

export const chat = async (ctx: CommandContext<Context>) => {
  await ctx.reply(`CHAT`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Close", callback_data: "cancel" }]],
    },
  });
};
