import { BotConversation } from "../../utils/util_bot";

export const slippageSetting = async (
  conversation: BotConversation,
  ctx: any
) => {
  const id = ctx.update.callback_query?.from.id;

  // Get the callback data to determine which slippage setting is being adjusted
  const callbackData = ctx.callbackQuery.data;

  let settingLabel: string;

  if (callbackData === "buy_slippage") {
    settingLabel = "Buy Slippage";
  } else if (callbackData === "sell_slippage") {
    settingLabel = "Sell Slippage";
  } else {
    await ctx.reply("Invalid selection.");
    return;
  }

  await ctx.reply(
    `You selected ${settingLabel}. Please enter the slippage percentage:`
  );

  // Wait for the user to enter the slippage percentage
  const {
    msg: { text: slippageText },
  } = await conversation.waitFor("message");

  if (!slippageText) {
    await ctx.reply(
      "Invalid input. Please enter a numeric slippage percentage."
    );
    return;
  }

  // Validate the input
  const slippage = parseFloat(slippageText);

  if (isNaN(slippage) || slippage <= 0) {
    await ctx.reply(
      "Invalid input. Please enter a valid numeric slippage percentage."
    );
    return;
  }

  // Save the slippage setting for the user (you would typically update this in your database)
  await ctx.reply(`${settingLabel} has been set to ${slippage}%.`);

  // Example: Save the setting in the user's profile (replace this with actual database logic)

  // End the conversation
  await ctx.reply(`The ${settingLabel} setting has been updated.`);
};
