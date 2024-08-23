import { buy } from "..";
import { BotConversation } from "../../utils";

export const buyButtonLayout = async (
  conversation: BotConversation,
  ctx: any
) => {
  const id = ctx.update.callback_query?.from.id;

  await ctx.reply("Enter a valid TRX-20 token address: ");

  const {
    msg: { text: trxTokenAddress },
  } = await conversation.waitFor("message");

  // Validate

  if (!trxTokenAddress) {
    await ctx.reply(
      "Invalid input. Please enter a valid TRX-20 token address."
    );
    return;
  }

  const tokenAddress = trxTokenAddress.trim();

  ctx.session.selectedToken = tokenAddress;

  await buy.start(ctx);
  await ctx.answerCallbackQuery();
};
