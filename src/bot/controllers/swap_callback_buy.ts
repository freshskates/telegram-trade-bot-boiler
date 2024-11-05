import { MonadClient } from "../../clients/monad";
import { SwapClient } from "../../clients/swap";
import bot from "../bot_init";
import { BotContext } from "../utils/utils";

async function cb_tokenSwapBuy_swap(ctx: BotContext) {
    await ctx.reply(
        `[dev] Selected Token: ${ctx.session.tokenAddress_selected}`
    );
    await ctx.reply(
        `[dev] Slippage: ${ctx.session.tokenSwapBuy_slippage_selected}%`
    );
    await ctx.reply(
        `[dev] Buy Amount: ${ctx.session.tokenSwapBuy_amount_selected}TRX`
    );

    const fromToken = "TRX";
    const toToken = ctx.session.tokenAddress_selected;

    if (!toToken) {
        await ctx.reply("Please select a token first");
        return;
    }

    const amount = ctx.session.tokenSwapBuy_amount_selected;

    if (!amount) {
        await ctx.reply("Please select an amount first");
        return;
    }

    const slippage = ctx.session.tokenSwapBuy_slippage_selected;

    if (!slippage) {
        await ctx.reply("Please select a slippage first");
        return;
    }

    const pk = ctx.user.user.walletPk;

    const walletBalance = await MonadClient.checkMonadBalance(
        ctx.user.user.walletPb
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
bot.callbackQuery("cb_tokenSwapBuy_swap", cb_tokenSwapBuy_swap);
