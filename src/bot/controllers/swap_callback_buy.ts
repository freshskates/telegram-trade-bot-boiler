import { SwapClient } from "../../clients/swap";
import { MonadClient } from "../../clients/monad";
import bot from "../bot_init";
import { BotContext } from "../utils/bot_utils";

async function cb_swapBuyToken_swap(ctx: BotContext) {
  await ctx.reply(`[dev] Selected Token: ${ctx.session.selectedToken}`);
  await ctx.reply(`[dev] Slippage: ${ctx.session.buyslippage}%`);
  await ctx.reply(`[dev] Buy Amount: ${ctx.session.buyamount}TRX`);

  const fromToken = "TRX";
  const toToken = ctx.session.selectedToken;

  if (!toToken) {
    await ctx.reply("Please select a token first");
    return;
  }

  const amount = ctx.session.buyamount;

  if (!amount) {
    await ctx.reply("Please select an amount first");
    return;
  }

  const slippage = ctx.session.buyslippage;

  if (!slippage) {
    await ctx.reply("Please select a slippage first");
    return;
  }

  const pk = ctx.session.user.walletPk;

  const walletBalance = await MonadClient.checkMonadBalance(
    ctx.session.user.walletPb
  );

  if (Number(walletBalance) < amount) {
    await ctx.reply(
      "Insufficient balance to perform this swap! You have " +
        walletBalance.monadBalance +
        " TRX in your wallet."
    );
    return;
  }

  const swap = await SwapClient.swap(
    pk,
    fromToken,
    toToken,
    amount.toString(),
    slippage
  );

  await ctx.answerCallbackQuery();
}
bot.callbackQuery("cb_swapBuyToken_swap", cb_swapBuyToken_swap);
