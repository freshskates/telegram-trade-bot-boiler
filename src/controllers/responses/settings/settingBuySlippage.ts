import { BotContext, BotConversation } from "../../../utils";
import { CallbackQueryContext } from "grammy";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const settingBuySlippage = async (
  conversation: BotConversation,
  ctx: BotContext
) => {
  const callbackData = ctx.callbackQuery?.data;
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  if (callbackData !== "buy_setting_slippage_cb") {
    await ctx.reply("Invalid selection.");
    return;
  }

  await ctx.reply("Please enter the new slippage percentage for Buy:");

  const { message } = await conversation.waitFor("message");

  const newSlippageAmount = parseFloat(message?.text || "0");

  if (isNaN(newSlippageAmount) || newSlippageAmount <= 0) {
    await ctx.reply("Invalid input. Please enter a valid numeric percentage.");
    return;
  }

  // Save to the database
  try {
    const updatedSettings = await prisma.settings.update({
      where: { userId: userId.toString() },
      data: {
        slippageBuy: newSlippageAmount,
      },
    });

    await ctx.reply(
      `The buy slippage has been updated to ${newSlippageAmount}%.`
    );
  } catch (error) {
    console.error("Error updating settings:", error);
    await ctx.reply(
      "There was an error saving your settings. Please try again."
    );
  }

  await ctx.answerCallbackQuery();
};

export const start = async (ctx: CallbackQueryContext<BotContext>) => {
  await ctx.conversation.exit();
  await ctx.conversation.reenter("set_buy_slippage");
  await ctx.answerCallbackQuery();
};
