import { CallbackQueryContext, Context } from "grammy";

export const cancel = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.deleteMessage();
  await ctx.answerCallbackQuery();
};

export const help = async (ctx: CallbackQueryContext<Context>) => {
  await ctx.reply(
    `
*How do I use Electron?*
Check out our [Youtube playlist](https://www.youtube.com/@ElectronOnTron) where we explain it all.

*Which tokens can I trade?*
Any TRC-20 token that is tradeable via JustSwap, including TRX and USDT pairs. We also support directly trading through SunSwap if JustSwap fails to find a route. You can trade newly created TRX pairs (not USDT) directly through SunSwap.

*Where can I find my referral code?*
Open the /start menu and click 💰Referrals.

*My transaction timed out. What happened?*
Transaction timeouts can occur when there is heavy network load or instability. This is simply the nature of the current Tron network.

*What are the fees for using Electron?*
Transactions through Electron incur a fee of 1%, or 0.9% if you were referred by another user. We don't charge a subscription fee or pay-wall any features.

*My net profit seems wrong, why is that?*
The net profit of a trade takes into consideration the trade's transaction fees. Confirm the details of your trade on TronScan.org to verify the net profit.

*Additional questions or need support?*
Join our Telegram group @electron and one of our admins can assist you.
    `,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Close", callback_data: "cancel" }]],
      },
    }
  );

  await ctx.answerCallbackQuery();
};
