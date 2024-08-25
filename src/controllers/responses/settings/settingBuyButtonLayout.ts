import { BotContext, BotConversation } from "../../../utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const buyButtonLayout = async (
  conversation: BotConversation,
  ctx: any
) => {
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  const callbackData = ctx.callbackQuery.data;

  let settingField: string;
  let settingLabel: string;

  if (callbackData === "buy_button_tl_cb") {
    settingField = "buyTopLeftX";
    settingLabel = "Top Left";
  } else if (callbackData === "buy_button_tc_cb") {
    settingField = "buyTopCenterX";
    settingLabel = "Top Center";
  } else if (callbackData === "buy_button_tr_cb") {
    settingField = "buyTopRightX";
    settingLabel = "Top Right";
  } else if (callbackData === "buy_button_bl_cb") {
    settingField = "buyBottomLeftX";
    settingLabel = "Bottom Left";
  } else if (callbackData === "buy_button_br_cb") {
    settingField = "buyBottomRightX";
    settingLabel = "Bottom Right";
  } else {
    await ctx.reply("Invalid selection.");
    return;
  }

  await ctx.reply(`You selected ${settingLabel}. Please enter the TRX amount:`);

  const {
    msg: { text: trxAmountText },
  } = await conversation.waitFor("message");

  if (!trxAmountText) {
    await ctx.reply("Invalid input. Please enter a numeric TRX amount.");
    return;
  }

  const trxAmount = parseFloat(trxAmountText);

  if (isNaN(trxAmount) || trxAmount <= 0) {
    await ctx.reply("Invalid input. Please enter a valid numeric TRX amount.");
    return;
  }

  // Update the database with the new value
  try {
    const updatedSettings = await prisma.settings.update({
      where: { userId: userId.toString() },
      data: {
        [settingField]: trxAmount,
      },
    });

    await ctx.reply(
      `Setting saved: ${settingLabel} TRX amount set to ${trxAmount} TRX.`
    );
  } catch (error) {
    console.error("Error updating settings:", error);
    await ctx.reply(
      "There was an error saving your settings. Please try again."
    );
  }

  await ctx.answerCallbackQuery();
};
