import { createConversation } from "@grammyjs/conversations";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";
import bot from "../../bot_init";
import { buy } from "../buy";

async function fetchSlippageByButtonId(
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

  if (buttonId === "cb_buy_slippagebutton") {
    return settings.slippageBuy;
  }

  return 0;
}

export async function conversation_buySlippage(
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
    if (callbackData === "cb_buy_slippagebutton_x") {
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

      ctx.session.buyslippage = customSlippage;

      const prisma = getPrismaClientSingleton();
      const updatedSettings = await prisma.settings.update({
        where: { userId: userId.toString() },
        data: {
          slippageBuyCustom: customSlippage,
          selectedBuySlippage: customSlippage,
        },
      });

      await ctx.reply(`You have selected to use ${customSlippage}% slippage.`);
      await buy.buyTrx(ctx, true);

      return;
    } else {
      const slippage = await fetchSlippageByButtonId(
        userId.toString(),
        callbackData
      );

      await ctx.reply(`You have selected to use ${slippage}% slippage.`);

      const prisma = getPrismaClientSingleton();
      const updatedSettings = await prisma.settings.update({
        where: { userId: userId.toString() },
        data: {
          selectedBuySlippage: slippage,
        },
      });

      // await ctx.answerCallbackQuery(); // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION
      ctx.session.buyslippage = slippage;
      await buy.buyTrx(ctx, true);

      return;
    }
  }
}

/* 
**************************************************
Buy Menu - Slippage Conversation
**************************************************
*/

bot.use(createConversation(conversation_buySlippage, "conversation_buySlippage"));
bot.callbackQuery("cb_buy_slippagebutton", async (ctx) => {
  await ctx.conversation.enter("conversation_buySlippage");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_buy_slippagebutton_x", async (ctx) => {
  await ctx.conversation.enter("conversation_buySlippage");
  await ctx.answerCallbackQuery();
});
