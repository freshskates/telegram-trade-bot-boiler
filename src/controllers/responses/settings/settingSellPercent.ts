import { BotContext, BotConversation } from "../../../utils";
import { CallbackQueryContext } from "grammy";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const settingSellPercent = async (
  conversation: BotConversation,
  ctx: BotContext
) => {
  const callbackData = ctx.callbackQuery?.data; // This should be the callback data from the button
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  let selectedPercentField: string;
  let percentSetting: string;

  if (callbackData === "sell_percent_l_cb") {
    percentSetting = "Sell Left Percent";
    selectedPercentField = "sellLeftPercentX";
  } else if (callbackData === "sell_percent_r_cb") {
    percentSetting = "Sell Right Percent";
    selectedPercentField = "sellRightPercentX";
  } else {
    await ctx.reply("Invalid selection.");
    return;
  }

  await ctx.reply(
    `Please enter the new percentage amount for ${percentSetting}:`
  );

  const { message } = await conversation.waitFor("message");

  const newPercentAmount = parseFloat(message?.text || "0");

  if (isNaN(newPercentAmount) || newPercentAmount <= 0) {
    await ctx.reply("Invalid input. Please enter a valid numeric percentage.");
    return;
  }

  // Save to the database
  try {
    const updatedSettings = await prisma.settings.update({
      where: { userId: userId.toString() },
      data: {
        [selectedPercentField]: newPercentAmount,
      },
    });

    await ctx.reply(
      `The ${percentSetting} has been updated to ${newPercentAmount}%.`
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
  await ctx.conversation.reenter("set_sell_percent");
  await ctx.answerCallbackQuery();
};
