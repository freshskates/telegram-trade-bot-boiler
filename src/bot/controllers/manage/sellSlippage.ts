import { createConversation } from "@grammyjs/conversations";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";
import bot from "../../bot_init";
import { sell } from "../sell";

async function fetchSellSlippageByButtonId(
  userId: string,
  buttonId: string
): Promise<number> {
  const prisma = getPrismaClientSingleton();
  const settings = await prisma.settings.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!settings) {
    throw new Error("Settings not found for user.");
  }

  if (buttonId === "sell_slippagebutton_cb") {
    return settings.slippageSell;
  }

  return 0;
}

export async function conversation_sellSlippage(
  conversation: BotConversation,
  ctx: BotContext
) {
  const callbackData = ctx.callbackQuery?.data;
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  if (callbackData) {
    if (callbackData === "cb_sell_slippagebutton_x") {
      await ctx.reply(
        "Please enter the custom slippage percentage you wish to use:"
      );

      const { message } = await conversation.wait();

      const customSlippage = parseFloat(message?.text || "0");

      if (isNaN(customSlippage) || customSlippage < 0) {
        return await ctx.reply(
          "Invalid slippage value. Please enter a valid percentage."
        );
      }

      ctx.session.sellslippage = customSlippage;

      const prisma = getPrismaClientSingleton();
      const updatedSettings = await prisma.settings.update({
        where: { userId: userId.toString() },
        data: {
          slippageSellCustom: customSlippage,
          selectedSellSlippage: customSlippage,
        },
      });

      await ctx.reply(`You have selected to use ${customSlippage}% slippage.`);
      await sell.start(ctx, true);

      return;
    } else {
      const slippage = await fetchSellSlippageByButtonId(
        userId.toString(),
        callbackData
      );

      await ctx.reply(`You have selected to use ${slippage}% slippage.`);

      ctx.session.sellslippage = slippage;

      const prisma = getPrismaClientSingleton();
      const updatedSettings = await prisma.settings.update({
        where: { userId: userId.toString() },
        data: {
          selectedSellSlippage: slippage,
        },
      });

      await sell.start(ctx, true);

      // await ctx.answerCallbackQuery();  // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION
      return;
    }
  }
}

/* 
**************************************************
Sell Menu - Set Sell Slippage
**************************************************
*/

bot.use(
  createConversation(
    conversation_sellSlippage,
    "conversation_sellSlippageSetting"
  )
);

bot.callbackQuery("cb_sell_setting_slippage", async (ctx) => {
  await ctx.conversation.enter("conversation_sellSlippageSetting");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_sell_slippagebutton_x", async (ctx) => {
  await ctx.conversation.enter("conversation_sellSlippageSetting");
  await ctx.answerCallbackQuery();
});
