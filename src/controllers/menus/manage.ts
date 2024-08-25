import { CallbackQueryContext, Context } from "grammy";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";

import base58 from "bs58";

import "dotenv/config";
import { BotContext } from "../../utils";
import { PrismaClient } from "@prisma/client";

type CusConversation = Conversation<BotContext>;

export const start = async (ctx: BotContext) => {
  const tokenAddress = ctx.session.selectedToken;
  const userId = ctx.from?.id;

  if (!userId) {
    return;
  }

  const prisma = new PrismaClient();
  const settings = await prisma.settings.findUnique({
    where: {
      userId: userId.toString(),
    },
  });

  if (!settings) {
    return;
  }

  const selectedBuyAmount = ctx.session.buyamount;

  const inlineKeyboard = [
    [
      {
        text: "Back",
        callback_data: "back_cb",
      },
      {
        text: "Refresh",
        callback_data: "refresh_buy_page_cb",
      },
    ],
    [
      {
        text: `${selectedBuyAmount === settings.buyTopLeftX ? "✅ " : ""}Buy ${
          settings.buyTopLeftX
        } TRX`,
        callback_data: "swap_buybutton_tl_cb",
      },
      {
        text: `${
          selectedBuyAmount === settings.buyTopCenterX ? "✅ " : ""
        }Buy ${settings.buyTopCenterX} TRX`,
        callback_data: "swap_buybutton_tc_cb",
      },
      {
        text: `${selectedBuyAmount === settings.buyTopRightX ? "✅ " : ""}Buy ${
          settings.buyTopRightX
        } TRX`,
        callback_data: "swap_buybutton_tr_cb",
      },
    ],
    [
      {
        text: `${
          selectedBuyAmount === settings.buyBottomLeftX ? "✅ " : ""
        }Buy ${settings.buyBottomLeftX} TRX`,
        callback_data: "swap_buybutton_bl_cb",
      },
      {
        text: `${
          selectedBuyAmount === settings.buyBottomRightX ? "✅ " : ""
        }Buy ${settings.buyBottomRightX} TRX`,
        callback_data: "swap_buybutton_br_cb",
      },
      {
        text: "Buy X TRX ✏️",
        callback_data: "swap_buybutton_x_cb",
      },
    ],
    [
      {
        text: `✅ ${settings.slippageBuy}% Slippage`,
        callback_data: "buy_slippagebutton_cb",
      },
      {
        text: "X Slippage ✏️",
        callback_data: "buy_slippagebutton_x_cb",
      },
    ],
    [
      {
        text: "Swap",
        callback_data: "swap_buy",
      },
    ],
  ];

  await ctx.reply(
    `
Buy \$DRAWN — (drawn cat) 📈 [link](https://dexscreener.com/solana/9M53sMUqbZKyBhqrfPW6erZModxadJMFUtRJahJFpump?id=95977a2a) 
\`${tokenAddress}\`

Balance: *2.027 TRX* [link](https://t.me/helenus_trojanbot?start=walletMenu)
Price: *\$0.0005016* — LIQ: *\$80.53K* — MC: *\$501.55K*
30m: *-41.59%* — 24h: *818.75%*
Renounced ✅ | Not Rugged ✅

*8 SOL (\$1,146.62) ⇄ 2.21M DRAWN (\$1,109.80)*

Price Impact: *3.21%*
Liquidity SOL: *281.229* — DRAWN: *80.19M*
    `,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    }
  );
};

export const prompt = async (ctx: CallbackQueryContext<BotContext>) => {
  return await ctx.reply("Enter a valid TRX-20 token address: ");
};
