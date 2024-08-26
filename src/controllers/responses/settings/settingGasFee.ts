import { BotContext, BotConversation } from "../../../utils";
import { CallbackQueryContext } from "grammy";
import { PrismaClient } from "@prisma/client";
import { gasFee } from "../..";

const prisma = new PrismaClient();

export const setGas = async (conversation: BotConversation, ctx: any) => {
  const callbackData = ctx.callbackQuery.data; // This should be the callback data from the button

  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  let selectedGasFee = 50;

  let gasSetting;

  if (callbackData === "set_gas_1_cb") {
    gasSetting = "Economy 🐴";
    selectedGasFee = 50;
  } else if (callbackData === "set_gas_2_cb") {
    gasSetting = "Normal 🚀";
    selectedGasFee = 100;
  } else if (callbackData === "set_gas_3_cb") {
    gasSetting = "Ultra 🦄";
    selectedGasFee = 200;
  } else if (callbackData === "set_gas_x_cb") {
    await ctx.reply("Please enter your custom gas amount (in TRX):");

    const {
      msg: { text: customGas },
    } = await conversation.waitFor("message");

    if (!customGas) {
      await ctx.reply("Invalid input. Please enter a numeric value.");
      return;
    }

    const customGasNumber = parseFloat(customGas);

    selectedGasFee = customGasNumber;

    if (!isNaN(customGasNumber)) {
      gasSetting = `Custom: ${customGasNumber} TRX`;
    } else {
      await ctx.reply("Invalid input. Please enter a numeric value.");
      return;
    }
  }

  // save to db

  try {
    const updatedSettings = await prisma.settings.update({
      where: { userId: userId.toString() },
      data: {
        gasFee: selectedGasFee,
      },
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    await ctx.reply(
      "There was an error saving your settings. Please try again."
    );
  }

  await ctx.reply(`You have selected ${gasSetting} gas setting.`);
  //   conversation.session.gasSetting = gasSetting;

  await ctx.answerCallbackQuery();
};

export const start = async (ctx: CallbackQueryContext<BotContext>) => {
  await ctx.conversation.exit();
  await ctx.conversation.reenter("set_gas");
  await ctx.answerCallbackQuery();
};
