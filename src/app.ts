import { Bot, Context, session } from "grammy";
import {
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import config from "./config/config";

type BotContext = Context & ConversationFlavor;

const bot = new Bot<BotContext>(config.getTgBotToken());

(async function () {
  try {
    // await connectDB();
    bot.use(
      session({
        initial() {
          return {};
        },
      })
    );

    bot.use(conversations());
    // bot.command("start", root.start);
    // bot.command("settings", root.settings);
    // bot.command("help", root.help);
    // bot.command("chat", root.chat);

    // bot.callbackQuery("cancel", common.cancel);

    // bot.callbackQuery("wallet", wallet.start);
    // bot.callbackQuery("wallet_reset", wallet.reset);
    // bot.callbackQuery("wallet_reset_confirm", wallet.resetConfirm);
    // bot.callbackQuery("wallet_export", wallet.exportPrvkey);
    // bot.callbackQuery("wallet_export_confirm", wallet.exportPrvkeyConfirm);
    // bot.callbackQuery("wallet_refresh", wallet.refresh);
    // bot.callbackQuery("wallet_deposit", wallet.deposit);

    // bot.use(createConversation(split.splitConversation, "split"));
    // bot.callbackQuery("split", split.split);

    // bot.use(createConversation(wallet.withdrawConversation, "wallet-withdraw"));
    // bot.callbackQuery("wallet_withdraw", wallet.withdraw);

    // bot.use(createConversation(buy.buyConversation, "buy"));
    // bot.callbackQuery("buy", buy.buy);

    // bot.use(createConversation(swap.swapConversation, "swap"));
    // bot.callbackQuery("swap", swap.swap);

    // bot.use(createConversation(sell.sellConversation, "sell"));
    // bot.callbackQuery("sell", sell.sell);

    bot.start();
  } catch (err) {
    console.log(err);
  }
})();
