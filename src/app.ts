import { Bot, Context, GrammyError, HttpError, session } from "grammy";
import {
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import config from "./config/config";
import {
  root,
  common,
  settings,
  buy,
  gasFee,
  buyButtonLayout,
} from "./controllers";
import { BotContext } from "./utils";
import { UserClient } from "./clients/user";
import { userSessionMiddleware } from "./middleware/usersessionmw";

const bot = new Bot<BotContext>(config.getTgBotToken());

(async function () {
  try {
    bot.use(
      session({
        initial() {
          return {};
        },
      })
    );

    bot.use(userSessionMiddleware()); //custom mw, grabs user info from db and adds to ctx

    bot.use(conversations());

    bot.command("start", root.start);
    bot.command("help", root.help);

    bot.callbackQuery("help", common.help);
    bot.callbackQuery("cancel", common.cancel);
    bot.callbackQuery("settings", settings.start);

    bot.use(createConversation(settings.buyButtonConversation, "buybutton"));
    bot.callbackQuery("buybutton", settings.buybutton);

    bot.callbackQuery("buy", buy.start);

    // buy button X setting

    bot.use(
      createConversation(
        buyButtonLayout.buyButtonLayout,
        "trxAmountSettingConversation"
      )
    );

    bot.callbackQuery("buy_button_tl", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });

    bot.callbackQuery("buy_button_tc", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });

    bot.callbackQuery("buy_button_tr", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });

    bot.callbackQuery("buy_button_bl", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });

    bot.callbackQuery("buy_button_br", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });

    // end of buy button X setting

    // gas fee setting
    bot.use(createConversation(gasFee.setGas, "gasSettingConversation"));
    bot.callbackQuery("set_gas_1", async (ctx) => {
      await ctx.conversation.enter("gasSettingConversation");
    });

    bot.callbackQuery("set_gas_2", async (ctx) => {
      await ctx.conversation.enter("gasSettingConversation");
    });

    bot.callbackQuery("set_gas_3", async (ctx) => {
      await ctx.conversation.enter("gasSettingConversation");
    });

    bot.callbackQuery("set_gas_x", async (ctx) => {
      await ctx.conversation.enter("gasSettingConversation");
    });

    // end of gas fee setting

    bot.hears(/^T[a-zA-Z0-9]{33}$/, async (ctx: BotContext) => {
      if (!ctx?.message?.text) return;

      const token = ctx?.message.text?.trim();
      ctx.session.selectedToken = token;

      return await buy.start(ctx);
    });

    bot.catch((err) => {
      const ctx = err.ctx;
      console.error(`Error while handling update ${ctx.update.update_id}:`);
      const e = err.error;
      if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
      } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
      } else {
        console.error("Unknown error:", e);
      }
    });

    bot.start();
  } catch (err) {
    console.log(err);
  }
})();
