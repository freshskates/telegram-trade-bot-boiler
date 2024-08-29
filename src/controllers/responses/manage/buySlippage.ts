import { Conversation } from "@grammyjs/conversations";
import { BotContext, BotConversation } from "../../../utils";
import { PrismaClient } from "@prisma/client";

async function fetchSlippageByButtonId(
  userId: string,
  buttonId: string
): Promise<number> {
  const prisma = new PrismaClient();
  const settings = await prisma.settings.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!settings) {
    throw new Error("Settings not found for user.");
  }

  if (buttonId === "buy_slippagebutton_cb") {
    return settings.slippageBuy;
  }

  return 0;
}

export async function slippageConversation(
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
    if (callbackData === "buy_slippagebutton_x_cb") {
      await ctx.reply(
        "Please enter the custom slippage percentage you wish to use:"
      );

      const { message } = await conversation.wait();

      const customSlippage = parseFloat(message?.text || "0");

      if (isNaN(customSlippage) || customSlippage <= 0) {
        return await ctx.reply(
          "Invalid slippage value. Please enter a valid percentage."
        );
      }

      ctx.session.buyslippage = customSlippage;

      await ctx.reply(`You have selected to use ${customSlippage}% slippage.`);

      return;
    } else {
      const slippage = await fetchSlippageByButtonId(
        userId.toString(),
        callbackData
      );

      await ctx.reply(`You have selected to use ${slippage}% slippage.`);

      ctx.session.buyslippage = slippage;

      await ctx.answerCallbackQuery();
      return;
    }
  }
}
