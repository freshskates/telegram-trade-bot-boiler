import { Conversation } from "@grammyjs/conversations";
import { BotContext, BotConversation } from "../../utils";

// Mock function to simulate fetching slippage value from the database
async function fetchSlippageByButtonId(buttonId: string): Promise<number> {
  const mockDatabase: Record<string, any> = {
    buy_slippagebutton_cb: 2, // 2% Slippage
    buy_slippagebutton_x_cb: 0, // Custom slippage input
  };

  return mockDatabase[buttonId];
}

export async function slippageConversation(
  conversation: BotConversation,
  ctx: BotContext
) {
  const callbackData = ctx.callbackQuery?.data;

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
      const slippage = await fetchSlippageByButtonId(callbackData);

      await ctx.reply(`You have selected to use ${slippage}% slippage.`);

      ctx.session.buyslippage = slippage;

      await ctx.answerCallbackQuery();
      return;
    }
  }
}
