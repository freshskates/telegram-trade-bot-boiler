import { BotContext, BotConversation } from "../../utils";
import { CallbackQueryContext } from "grammy";

export const setGas = async (conversation: BotConversation, ctx: any) => {
  const callbackData = ctx.callbackQuery.data; // This should be the callback data from the button

  let gasSetting;
  if (callbackData === "set_gas_1") {
    gasSetting = "Economy 🐴";
  } else if (callbackData === "set_gas_2") {
    gasSetting = "Normal 🚀";
  } else if (callbackData === "set_gas_3") {
    gasSetting = "Ultra 🦄";
  } else if (callbackData === "set_gas_x") {
    await ctx.reply("Please enter your custom gas amount (in TRX):", {
      parse_mode: "HTML",
    });

    const {
      msg: { text: customGas },
    } = await conversation.waitFor("message");

    if (!customGas) {
      await ctx.reply("Invalid input. Please enter a numeric value.");
      return;
    }

    const customGasNumber = parseFloat(customGas);

    if (!isNaN(customGasNumber)) {
      gasSetting = `Custom: ${customGasNumber} TRX`;
    } else {
      await ctx.reply("Invalid input. Please enter a numeric value.");
      return;
    }
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
