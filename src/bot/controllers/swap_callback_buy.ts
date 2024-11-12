import { MonadCoinClient } from "../defined/MonadCoinClient";
import { SwapClient } from "../defined/SwapClient";
import bot from "../bot_init";
import { BotContext } from "../utils/bot_utility";
import getBotSharedSingleton from "../defined/BotShared";

async function cb_swapCoinToToken_swap(ctx: BotContext) {
    await ctx.reply(
        `[dev] Selected Token: ${ctx.session.tokenAddress_selected}`
    );
    await ctx.reply(
        `[dev] Slippage: ${ctx.session.swapCoinToToken_slippage_selected}%`
    );
    await ctx.reply(
        `[dev] Buy Amount: ${ctx.session.swapCoinToToken_amount_selected}TRX`
    );

    const fromToken = "TRX";
    const toToken = ctx.session.tokenAddress_selected;

    if (!toToken) {
        await ctx.reply("Please select a token first");
        return;
    }

    const amount = ctx.session.swapCoinToToken_amount_selected;

    if (!amount) {
        await ctx.reply("Please select an amount first");
        return;
    }

    const slippage = ctx.session.swapCoinToToken_slippage_selected;

    if (!slippage) {
        await ctx.reply("Please select a slippage first");
        return;
    }

    const walletPrivateKey = ctx.user.user.walletPrivateKey;

    const walletCoinBalance = await getBotSharedSingleton().getCoinClient().getCoinWalletBalance(
        ctx.user.user.walletPublicKey
    );

    if (Number(walletCoinBalance) < amount) {
        await ctx.reply(
            "Insufficient balance to perform this swap! You have " +
                walletCoinBalance.coinBalance +
                " TRX in your wallet."
        );
        return;
    }

    const swap = await SwapClient.swap(
        walletPrivateKey,
        fromToken,
        toToken,
        amount.toString(),
        slippage
    );

    await ctx.answerCallbackQuery();
}
bot.callbackQuery("cb_swapCoinToToken_swap", cb_swapCoinToToken_swap);
