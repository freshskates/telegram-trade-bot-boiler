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
  sell,
  settingSellPercent,
  settingSellSlippage,
  settingBuySlippage,
} from "./controllers";
import { BotContext } from "./utils";
import { UserClient } from "./clients/user";
import { userSessionMiddleware } from "./middleware/usersessionmw";
import { WalletClient } from "./clients/wallet";
import { SwapClient } from "./clients/swap";

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
    bot.callbackQuery("start_cb", root.start); // TODO: "start_cb" is never called
    bot.callbackQuery("help_cb", common.help);
    bot.callbackQuery("back_cb", common.back);
    bot.callbackQuery("cancel_cb", common.cancel);
    bot.callbackQuery("settings_cb", settings.start);

    bot.callbackQuery("tokens_owned_cb", tokensOwned.start);

    bot.callbackQuery("sell_cb", sell.start);

    bot.use(
      createConversation(
        settings.buyButtonConversation,
        "buybuttonConversation"
      )
    );
    bot.callbackQuery("buybutton_cb", settings.buybutton); // TODO: "buybutton_cb" is never called

    bot.use(
      createConversation(
        settings.buyButtonConversation,
        "buypromptConversation" // TODO: "buypromptConversation" is never used
      )
    );
    bot.callbackQuery("buy_cb", buy.prompt);

    bot.callbackQuery("swap_buy_cb", async (ctx) => {
      await ctx.reply("Swapping...");
      await ctx.reply(`Selected Token: ${ctx.session.selectedToken}`);
      await ctx.reply(`Slippage: ${ctx.session.buyslippage}%`);
      await ctx.reply(`Buy Amount: ${ctx.session.buyamount}TRX`);

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

      const swapClient = new SwapClient();

      const swap = await swapClient.swap(
        fromToken,
        toToken,
        amount.toString(),
        slippage.toString(),
        Number(pk)
      );

      await ctx.answerCallbackQuery();
    });

    /* 
    **************************************************
    Settings Menu - Set Sell Slippage
    **************************************************
    */

    bot.use(
      createConversation(
        settingSellSlippage.settingSellSlippage,
        "sellSlippageSettingConversation"
      )
    );

    bot.callbackQuery("sell_setting_slippage_cb", async (ctx) => {
      await ctx.conversation.enter("sellSlippageSettingConversation");
    });

    /* 
    **************************************************
    Settings Menu - Set Buy Slippage
    **************************************************
    */

    bot.use(
      createConversation(
        settingBuySlippage.settingBuySlippage,
        "buySlippageSettingConversation"
      )
    );

    bot.callbackQuery("buy_setting_slippage_cb", async (ctx) => {
      await ctx.conversation.enter("buySlippageSettingConversation");
    });

    /* 
    **************************************************
    Settings Menu - Set Sell Percents
    **************************************************
    */

    bot.use(
      createConversation(
        settingSellPercent.settingSellPercent,
        "sellPercentSettingConversation"
      )
    );

    bot.callbackQuery("sell_percent_l_cb", async (ctx) => {
      await ctx.conversation.enter("sellPercentSettingConversation");
    });

    bot.callbackQuery("sell_percent_r_cb", async (ctx) => {
      await ctx.conversation.enter("sellPercentSettingConversation");
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

    bot.callbackQuery("set_gas_x_cb", async (ctx) => {
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
