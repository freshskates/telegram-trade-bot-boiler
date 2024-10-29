import { createConversation } from "@grammyjs/conversations";
import bot from "../../bot_init";
import { sell } from "../../display/displaySwapSellToken";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";

// Function to fetch sell percent by button ID
async function fetchSellPercentByButtonId(
  userId: string,
  buttonId: string
): Promise<number> {
  const prisma = getPrismaClientSingleton();

  const settings = await prisma.settings.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!settings) {
    throw new Error("User settings not found");
  }

  switch (buttonId) {
    case "swap_sellbutton_left_cb":
      return settings.sellLeftPercentX;
    case "swap_sellbutton_right_cb":
      return settings.sellRightPercentX;
    default:
      throw new Error("Invalid button ID");
  }
}

export async function conversation_sellTrx(
  conversation: BotConversation,
  ctx: BotContext
) {
  const callbackData = ctx.callbackQuery?.data;
  const userId = ctx.update.callback_query?.from.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  if (callbackData) {
    if (callbackData === "swap_sellbutton_x_cb") {
      await ctx.reply("Please enter the percent of TRX you wish to sell:");

      const { message } = await conversation.wait();

      const customPercent = parseFloat(message?.text || "0");

      if (isNaN(customPercent) || customPercent < 0 || customPercent > 100) {
        return await ctx.reply(
          "Invalid percent. Please enter a valid number between 1 and 100."
        );
      }

      await ctx.reply(
        `You have selected to sell ${customPercent}% of your TRX.` // FIXME: Should be Coin Name not TRX
      );

      ctx.session.swapSellToekn_selected_percent = customPercent;

      const prisma = getPrismaClientSingleton();
      const updatedSettings = await prisma.settings.update({
        where: { userId: userId.toString() },
        data: {
          sellCustomX: customPercent,
          selectedSellPercent: customPercent,
        },
      });

      await sell.start(ctx, true); // Assuming a sell.start method exists similar to buy

      return;
    } else {
      try {
        const sellPercent = await fetchSellPercentByButtonId(
          userId.toString(),
          callbackData
        );

        // await ctx.answerCallbackQuery(); // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION
        ctx.session.swapSellToekn_selected_percent = sellPercent;
        const prisma = getPrismaClientSingleton();
        const updatedSettings = await prisma.settings.update({
          where: { userId: userId.toString() },
          data: {
            selectedSellPercent: sellPercent,
          },
        });

        await sell.start(ctx, true); // Assuming a sell.start method exists similar to buy
      } catch (error) {
        await ctx.reply("An error occurred while fetching your settings.");
      }
      return;
    }
  }
}

/* 
**************************************************
Sell Menu - Set Sell Percent
**************************************************
*/

bot.use(
  createConversation(conversation_sellTrx, "conversation_sellPercentMenu")
);

bot.callbackQuery(/swap_sellbutton_(left|right|x)_cb/, async (ctx) => {
  await ctx.conversation.enter("conversation_sellPercentMenu");
  await ctx.answerCallbackQuery();
});
