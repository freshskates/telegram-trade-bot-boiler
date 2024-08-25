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
  buyAmount,
  slippageSetting,
  tokensOwned,
} from "./controllers";
import { BotContext } from "./utils";
import { UserClient } from "./clients/user";
import { userSessionMiddleware } from "./middleware/usersessionmw";
import { WalletClient } from "./clients/wallet";

const bot = new Bot<BotContext>(config.getTgBotToken());

// TODO: refresh_cb?
// TODO: referrals_cb?
// TODO: positions_cb?
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

    // Chat commands
    bot.command("start", root.start);
    bot.command("help", root.help);

    /* 
    **************************************************
    Basic Buttons
    **************************************************
    */
    bot.callbackQuery("help_cb", common.help);
    bot.callbackQuery("back_cb", common.back);
    bot.callbackQuery("cancel_cb", common.cancel);
    bot.callbackQuery("settings_cb", settings.start);

    bot.callbackQuery("tokens_owned_cb", tokensOwned.start);

    bot.use(createConversation(settings.buyButtonConversation, "buybutton"));
    bot.callbackQuery("buybutton", settings.buybutton);

    bot.use(createConversation(settings.buyButtonConversation, "buyprompt"));
    bot.callbackQuery("buy", buy.prompt);

    bot.callbackQuery("swap_buy", async (ctx) => {
      await ctx.reply("Swapping...");
      await ctx.reply(`Selected Token: ${ctx.session.selectedToken}`);
      await ctx.reply(`Slippage: ${ctx.session.buyslippage}%`);
      await ctx.reply(`Buy Amount: ${ctx.session.buyamount}TRX`);

      await ctx.answerCallbackQuery();
    });

    /* 
    **************************************************
    Buy Menu - Slippage Conversation
    **************************************************
    */
    bot.use(
      createConversation(
        slippageSetting.slippageConversation,
        "buySlippageConversation"
      )
    );
    bot.callbackQuery("buy_slippagebutton_cb", async (ctx) => {
      await ctx.conversation.enter("buySlippageConversation");
    });

    bot.callbackQuery("buy_slippagebutton_x_cb", async (ctx) => {
      await ctx.conversation.enter("buySlippageConversation");
    });

    /* 
    **************************************************
    Buy Trx Conversation    
    **************************************************
    */

    bot.use(
      createConversation(buyAmount.buyTrxConversation, "swapAmountConversation")
    );
    bot.callbackQuery("swap_buybutton_tl_cb", async (ctx) => {
      await ctx.conversation.enter("swapAmountConversation");
    });

    bot.callbackQuery("swap_buybutton_tc_cb", async (ctx) => {
      await ctx.conversation.enter("swapAmountConversation");
    });

    bot.callbackQuery("swap_buybutton_tr_cb", async (ctx) => {
      await ctx.conversation.enter("swapAmountConversation");
    });

    bot.callbackQuery("swap_buybutton_bl_cb", async (ctx) => {
      await ctx.conversation.enter("swapAmountConversation");
    });

    bot.callbackQuery("swap_buybutton_br_cb", async (ctx) => {
      await ctx.conversation.enter("swapAmountConversation");
    });

    bot.callbackQuery("swap_buybutton_x_cb", async (ctx) => {
      await ctx.conversation.enter("swapAmountConversation");
    });

    /* 
    **************************************************
    Buy Button TRX Settings Conversation    
    **************************************************
    */

    bot.use(
      createConversation(
        buyButtonLayout.buyButtonLayout,
        "trxAmountSettingConversation"
      )
    );

    bot.callbackQuery("buy_button_tl_cb", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });

    bot.callbackQuery("buy_button_tc_cb", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });

    bot.callbackQuery("buy_button_tr_cb", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });

    bot.callbackQuery("buy_button_bl_cb", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });

    bot.callbackQuery("buy_button_br_cb", async (ctx) => {
      await ctx.conversation.enter("trxAmountSettingConversation");
    });
    // end of buy button X setting

    /* 
    **************************************************
    Gas Fees Setting Conversation   
    **************************************************
    */

    // gas fee setting
    bot.use(createConversation(gasFee.setGas, "gasSettingConversation"));
    bot.callbackQuery("set_gas_1_cb", async (ctx) => {
      await ctx.conversation.enter("gasSettingConversation");
    });

    bot.callbackQuery("set_gas_2_cb", async (ctx) => {
      await ctx.conversation.enter("gasSettingConversation");
    });

    bot.callbackQuery("set_gas_3_cb", async (ctx) => {
      await ctx.conversation.enter("gasSettingConversation");
    });

    bot.callbackQuery("set_gas_x", async (ctx) => {
      await ctx.conversation.enter("gasSettingConversation");
    });

    /* 
    ****************************************************************************************************
    Other    
    ****************************************************************************************************
    */

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
