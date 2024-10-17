/* 
**************************************************
Middleware
**************************************************
*/

import { GrammyError, HttpError } from "grammy";
import path from "path";
import { fileURLToPath } from "url";
import {
    buy
} from "../controllers";
import { BotContext } from "../utils";
import mainMenu from "./_test";
import auto_load_modules_from from "./auto_load_module";
import bot from "./bot_init";
import { middlewareAddUserDataToCTX } from "./middleware/middlewareAddUserDataToCTX";
import routerRoot from "./structure/root_router";

// TODO: refresh_cb?
// TODO: referrals_cb?
// TODO: positions_cb?

/* 
**************************************************
Middleware
**************************************************
*/

// Append user to CTX (Context) Middleware
bot.use(middlewareAddUserDataToCTX());

/* 
**************************************************
Load all possible js/ts files relative to this file's directory

Notes:
    The primary purpose is to automatically call
    bot.callbackQuery(...) from other files without
    those calls being explicitly called within this file.
**************************************************
*/

//@ts-ignore
const PATH_FILE_THIS_FILE = fileURLToPath(import.meta.url);
const PATH_DIRECTORY_THIS_FILE = path.dirname(PATH_FILE_THIS_FILE);
auto_load_modules_from(PATH_DIRECTORY_THIS_FILE);

/* 
**************************************************
Routes
**************************************************
*/

bot.use(routerRoot);

/////////////////////////////// PAST THIS POINT IS SOME OTHER SHIT

// Chat commands
// bot.command("start", RootLogic.start);
// bot.command("help", RootLogic.help);

bot.use(mainMenu);
bot.command("_test", (ctx) =>
    ctx.reply("Testing menu", { reply_markup: mainMenu })
);

/* 
**************************************************
Basic Buttons
**************************************************
*/
// Note: Tying the callback_name to it's actual funtion

// bot.callbackQuery("callback__main__start", RootLogic.start); // TODO: "callback__main__start" is never called

// bot.callbackQuery("callback__root__help", common.help);
// bot.callbackQuery("callback__root__back", common.back);
// bot.callbackQuery("callback__root__cancel", common.cancel);

// bot.callbackQuery("cb_settings", settings.start);

// bot.callbackQuery("cb_tokens_owned", tokensOwned.start);

// bot.callbackQuery(/token_(.+)_cb/, async (ctx) => {
//     const tokenAddress = ctx.match[1]; // Extract tokenAddress from the callback data
//     console.log(`Token Address: ${tokenAddress}`);

//     // You can then handle the logic based on the tokenAddress
//     ctx.session.selectedToken = tokenAddress;

//     await sell.start(ctx);
// });

// Note: Conversation (Part of conversation)

// WARNING: NOT FUCKING USED
// bot.use(
//     createConversation(
//         settings.conversation_buyButton,
//         "conversation_buyButton"
//     )
// );
// bot.callbackQuery("cb_buybutton", settings.buybutton); // TODO: "cb_buybutton" is never called

// WARNING: NOT FUCKING USED
// bot.use(
//     createConversation(
//         settings.conversation_buyButton,
//         "conversation_buyprompt" // TODO: "conversation_buyprompt" is never used
//     )
// );

// bot.callbackQuery("swap_callback_buy", async (ctx) => {
//     await ctx.reply(`[dev] Selected Token: ${ctx.session.selectedToken}`);
//     await ctx.reply(`[dev] Slippage: ${ctx.session.buyslippage}%`);
//     await ctx.reply(`[dev] Buy Amount: ${ctx.session.buyamount}TRX`);

//     const fromToken = "TRX";
//     const toToken = ctx.session.selectedToken;

//     if (!toToken) {
//         await ctx.reply("Please select a token first");
//         return;
//     }

//     const amount = ctx.session.buyamount;

//     if (!amount) {
//         await ctx.reply("Please select an amount first");
//         return;
//     }

//     const slippage = ctx.session.buyslippage;

//     if (!slippage) {
//         await ctx.reply("Please select a slippage first");
//         return;
//     }

//     const pk = ctx.session.user.walletPk;

//     const swapClient = new SwapClient();

//     const tronClient = new TronClient();
//     const walletBalance = await tronClient.checkBalance(
//         ctx.session.user.walletPb
//     );

//     if (Number(walletBalance) < amount) {
//         await ctx.reply(
//             "Insufficient balance to perform this swap! You have " +
//                 walletBalance +
//                 " TRX in your wallet."
//         );
//         return;
//     }

//     const swap = await swapClient.swap(
//         pk,
//         fromToken,
//         toToken,
//         amount.toString(),
//         slippage
//     );

//     await ctx.answerCallbackQuery();
// });

/* 
**************************************************
Sell Menu - Set Sell Percent
**************************************************
*/

// bot.use(
//     createConversation(
//         sellAmount.sellTrxConversation,
//         "conversation_sellPercentMenu"
//     )
// );

// bot.callbackQuery(/swap_sellbutton_(left|right|x)_cb/, async (ctx) => {
//     await ctx.conversation.enter("conversation_sellPercentMenu");
// });

/* 
**************************************************
Sell Menu - Set Sell Slippage
**************************************************
*/

// bot.use(
//     createConversation(
//         sellSlippage.sellSlippageConversation,
//         "conversation_sellSlippageSetting"
//     )
// );

// bot.callbackQuery("cb_sell_setting_slippage", async (ctx) => {
//     await ctx.conversation.enter("conversation_sellSlippageSetting");
// });

// bot.callbackQuery("cb_sell_slippagebutton_x", async (ctx) => {
//     await ctx.conversation.enter("conversation_sellSlippageSetting");
// });

/* 
**************************************************
Settings Menu - Set Buy Slippage
**************************************************
*/

// bot.use(
//     createConversation(
//         settingBuySlippage.settingBuySlippage,
//         "conversation_buySlippageSetting"
//     )
// );

// bot.callbackQuery("cb_buy_setting_slippage", async (ctx) => {
//     await ctx.conversation.enter("conversation_buySlippageSetting");
// });

/* 
**************************************************
Settings Menu - Set Sell Percents
**************************************************
*/

// bot.use(
//     createConversation(
//         settingSellPercent.settingSellPercent,
//         "conversation_sellPercentSetting"
//     )
// );

// bot.callbackQuery("cb_sell_percent_l", async (ctx) => {
//     await ctx.conversation.enter("conversation_sellPercentSetting");
// });

// bot.callbackQuery("cb_sell_percent_r", async (ctx) => {
//     await ctx.conversation.enter("conversation_sellPercentSetting");
// });

/* 
**************************************************
Buy Menu - Slippage Conversation
**************************************************
*/
// bot.use(
//     createConversation(
//         slippageSetting.slippageConversation,
//         "conversation_buySlippage"
//     )
// );
// bot.callbackQuery("cb_buy_slippagebutton", async (ctx) => {
//     await ctx.conversation.enter("conversation_buySlippage");
// });

// bot.callbackQuery("cb_buy_slippagebutton_x", async (ctx) => {
//     await ctx.conversation.enter("conversation_buySlippage");
// });

/* 
**************************************************
Buy Trx Conversation    
**************************************************
*/

// bot.use(
//     createConversation(buyAmount.buyTrxConversation, "conversation_swapAmount")
// );
// bot.callbackQuery("cb_swap_buybutton_tl", async (ctx) => {
//     await ctx.conversation.enter("conversation_swapAmount");
// });

// bot.callbackQuery("cb_swap_buybutton_tc", async (ctx) => {
//     await ctx.conversation.enter("conversation_swapAmount");
// });

// bot.callbackQuery("cb_swap_buybutton_tr", async (ctx) => {
//     await ctx.conversation.enter("conversation_swapAmount");
// });

// bot.callbackQuery("cb_swap_buybutton_bl", async (ctx) => {
//     await ctx.conversation.enter("conversation_swapAmount");
// });

// bot.callbackQuery("cb_swap_buybutton_br", async (ctx) => {
//     await ctx.conversation.enter("conversation_swapAmount");
// });

// bot.callbackQuery("cb_swap_buybutton_x", async (ctx) => {
//     await ctx.conversation.enter("conversation_swapAmount");
// });

/* 
**************************************************
Buy Button TRX Settings Conversation    
************************************************** 
*/

// bot.use(
//     createConversation(
//         buyButtonLayout.buyButtonLayout,
//         "conversation_trxAmountSetting"
//     )
// );

// bot.callbackQuery("cb_buy_button_tl", async (ctx) => {
//     await ctx.conversation.enter("conversation_trxAmountSetting");
// });

// bot.callbackQuery("cb_buy_button_tc", async (ctx) => {
//     await ctx.conversation.enter("conversation_trxAmountSetting");
// });

// bot.callbackQuery("cb_buy_button_tr", async (ctx) => {
//     await ctx.conversation.enter("conversation_trxAmountSetting");
// });

// bot.callbackQuery("cb_buy_button_bl", async (ctx) => {
//     await ctx.conversation.enter("conversation_trxAmountSetting");
// });

// bot.callbackQuery("cb_buy_button_br", async (ctx) => {
//     await ctx.conversation.enter("conversation_trxAmountSetting");
// });

/* 
**************************************************
Gas Fees Setting Conversation   
**************************************************
*/

// gas fee setting
// bot.use(createConversation(gasFee.setGas, "conversation_gasSetting"));
// bot.callbackQuery("cb_set_gas_1", async (ctx) => {
//     await ctx.conversation.enter("conversation_gasSetting");
// });

// bot.callbackQuery("cb_set_gas_2", async (ctx) => {
//     await ctx.conversation.enter("conversation_gasSetting");
// });

// bot.callbackQuery("cb_set_gas_3", async (ctx) => {
//     await ctx.conversation.enter("conversation_gasSetting");
// });

// bot.callbackQuery("cb_set_gas_x", async (ctx) => {
//     await ctx.conversation.enter("conversation_gasSetting");
// });

/* 
****************************************************************************************************
Other    
****************************************************************************************************
*/

// bot.hears(/^T[a-zA-Z0-9]{33}$/, async (ctx: BotContext) => {
//     if (!ctx?.message?.text) return;

//     const token = ctx?.message.text?.trim();
//     ctx.session.selectedToken = token;

//     return await buy.start(ctx);
// });

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
