import { BotConversation } from "../../utils";

export const buyButtonLayout = async (
  conversation: BotConversation,
  ctx: any
) => {
  const id = ctx.update.callback_query?.from.id;

  const callbackData = ctx.callbackQuery.data;

  let settingLabel: string;

  if (callbackData === "buy_button_tl") {
    settingLabel = "Top Left";
  } else if (callbackData === "buy_button_tc") {
    settingLabel = "Top Center";
  } else if (callbackData === "buy_button_tr") {
    settingLabel = "Top Right";
  } else if (callbackData === "buy_button_bl") {
    settingLabel = "Bottom Left";
  } else if (callbackData === "buy_button_br") {
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

  await ctx.reply(
    `Setting saved: ${settingLabel} TRX amount set to ${trxAmount} TRX.`
  );

  await ctx.answerCallbackQuery();
};
