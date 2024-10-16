import {
  conversations,
  createConversation
} from "@grammyjs/conversations";
import {
  Bot,
  Context,
  GrammyError,
  HttpError,
  NextFunction,
  session
} from "grammy";
import config from "../config/config";
import {
  buy,
  buyAmount,
  buyButtonLayout,
  common,
  gasFee,
  // root,
  sell,
  sellAmount,
  sellSlippage,
  settingBuySlippage,
  settings,
  settingSellPercent,
  slippageSetting,
  tokensOwned
} from "../controllers";

import { SwapClient } from "../clients/swap";
import { TronClient } from "../clients/tron";
import { BotContext } from "../utils";
import { middlewareAddUserDataToCTX } from "./middleware/middlewareAddUserDataToCTX";
import middlewareDebugger from "./middleware/_middlewareDebug";
import mainMenu from "./_test";
import { RootLogic } from "./structure/root_logic";
import routerRoot from "./structure/root_router";

const bot = new Bot<BotContext>(config.getTgBotToken());

// TODO: refresh_cb?
// TODO: referrals_cb?
// TODO: positions_cb?
(async function () {
    try {


        // Session Middleware
        bot.use(
            // Session middleware provides a persistent data storage for your bot.
            session({
                // initial option in the configuration object, which correctly initializes session objects for new chats.
                initial() {
                    return {}; // return empty object for now
                },
            })
        );


        /* 
        Install the conversations plugin.
          Notes:
              
          Reference:
            https://grammy.dev/plugins/conversations#installing-and-entering-a-conversation    

        */
        bot.use(conversations()); // Note: External library stuff


        /* 
        **************************************************
        Middleware
        **************************************************
        */


        // Append user to CTX (Context) Middleware
        bot.use(middlewareAddUserDataToCTX());

        bot.use(middlewareDebugger);



        bot.use(routerRoot)

        // Chat commands
        // bot.command("start", RootLogic.start);
        bot.command("help", RootLogic.help);

        bot.use(mainMenu);
        bot.command('_test', ctx => ctx.reply("Testing menu", { reply_markup: mainMenu }))

        /* 
        **************************************************
        Basic Buttons
        **************************************************
        */
        // Note: Tying the callback_name to it's actual funtion
        bot.callbackQuery("callback__main__start", RootLogic.start); // TODO: "callback__main__start" is never called
        bot.callbackQuery("callback__main__help", common.help);
        bot.callbackQuery("callback__main__back", common.back);
        bot.callbackQuery("callback__main__cancel", common.cancel);
        bot.callbackQuery("callback__main__settings", settings.start);
        bot.callbackQuery("callback__main__buy", buy.prompt);

        bot.callbackQuery("callback_tokens_owned", tokensOwned.start);

        bot.callbackQuery(/token_(.+)_cb/, async (ctx) => {
            const tokenAddress = ctx.match[1]; // Extract tokenAddress from the callback data
            console.log(`Token Address: ${tokenAddress}`);

            // You can then handle the logic based on the tokenAddress
            ctx.session.selectedToken = tokenAddress;

            await sell.start(ctx);
        });

        // Note: Conversation (Part of conversation)

        // WARNING: NOT FUCKING USED
        bot.use(
            createConversation(
                settings.buyButtonConversation,
                "buybuttonConversation"
            )
        );
        bot.callbackQuery("buybutton_cb", settings.buybutton); // TODO: "buybutton_cb" is never called

        // WARNING: NOT FUCKING USED
        bot.use(
            createConversation(
                settings.buyButtonConversation,
                "buypromptConversation" // TODO: "buypromptConversation" is never used
            )
        );

        bot.callbackQuery("swap_callback_buy", async (ctx) => {
            await ctx.reply(
                `[dev] Selected Token: ${ctx.session.selectedToken}`
            );
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

            const swapClient = new SwapClient();

            const tronClient = new TronClient();
            const walletBalance = await tronClient.checkBalance(
                ctx.session.user.walletPb
            );

            if (Number(walletBalance) < amount) {
                await ctx.reply(
                    "Insufficient balance to perform this swap! You have " +
                        walletBalance +
                        " TRX in your wallet."
                );
                return;
            }

            const swap = await swapClient.swap(
                pk,
                fromToken,
                toToken,
                amount.toString(),
                slippage
            );

            await ctx.answerCallbackQuery();
        });

        /* 
        **************************************************
        Sell Menu - Set Sell Percent
        **************************************************
        */

        bot.use(
            createConversation(
                sellAmount.sellTrxConversation,
                "sellPercentMenuConversation"
            )
        );

        bot.callbackQuery(/swap_sellbutton_(left|right|x)_cb/, async (ctx) => {
            await ctx.conversation.enter("sellPercentMenuConversation");
        });

        /* 
        **************************************************
        Sell Menu - Set Sell Slippage
        **************************************************
        */

        bot.use(
            createConversation(
                sellSlippage.sellSlippageConversation,
                "sellSlippageSettingConversation"
            )
        );

        bot.callbackQuery("sell_setting_slippage_cb", async (ctx) => {
            await ctx.conversation.enter("sellSlippageSettingConversation");
        });

        bot.callbackQuery("sell_slippagebutton_x_cb", async (ctx) => {
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
            createConversation(
                buyAmount.buyTrxConversation,
                "swapAmountConversation"
            )
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
            console.error(
                `Error while handling update ${ctx.update.update_id}:`
            );
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
