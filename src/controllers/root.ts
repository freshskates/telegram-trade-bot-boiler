import { CommandContext, Context } from "grammy";
import base58 from "bs58";

export const start = async (ctx: CommandContext<Context>) => {
  const id = ctx.message?.from.id;
  const referral = ctx.message?.text?.replace("/start", "")?.trim();

  // if (!user) {
  // create user
  // }

  const wallet = web3.Keypair.fromSecretKey(base58.decode(user.wallet ?? ""));
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(balance);
  console.log(wallet);
  console.log(user.user);
  await ctx.reply(
    `
        <b>Welcome to Tron Telegram Bot</b>\n\n${
          balance === 0
            ? "You currently have no TRX balance. To get started with trading, send some SOL to your Bot wallet address:"
            : `Your balance is <b>${
                balance / web3.LAMPORTS_PER_SOL
              }</b> SOL. You can start trading with your wallet address:`
        } \n\n<code>${wallet.publicKey}</code>`,
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
    },
  );
};

export const settings = async (ctx: CommandContext<Context>) => {
  const id = ctx.message?.from.id;

  let user = await User.findOne({ user: id });

  if (!user) {
    const newWallet = TronClient.createWallet();

    user = new User({
      user: id,
      wallet: base58.encode(newWallet.secretKey),
    });
    await user.save();
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
