import { createConversation } from "@grammyjs/conversations";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";
import bot from "../../bot_init";
import { buy } from "../buy";

async function fetchTrxAmountByButtonId(
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
    case "cb_swap_buybutton_tl":
      return settings.buyTopLeftX;
    case "cb_swap_buybutton_tc":
      return settings.buyTopCenterX;
    case "cb_swap_buybutton_tr":
      return settings.buyTopRightX;
    case "cb_swap_buybutton_bl":
      return settings.buyBottomLeftX;
    case "cb_swap_buybutton_br":
      return settings.buyBottomRightX;
    default:
      throw new Error("Invalid button ID");
  }
}

export async function conversation_buyTrx(
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
    if (callbackData === "cb_swap_buybutton_x") {
      await ctx.reply("Please enter the amount of TRX you wish to buy:");

      const { message } = await conversation.wait();

      const customAmount = parseFloat(message?.text || "0");

      if (isNaN(customAmount) || customAmount < 0) {
        return await ctx.reply("Invalid amount. Please enter a valid number.");
      }

      //   await ctx.reply(`You have selected to buy ${customAmount} TRX.`);

      ctx.session.buyamount = customAmount;

      const prisma = getPrismaClientSingleton();
      const updatedSettings = await prisma.settings.update({
        where: { userId: userId.toString() },
        data: {
          buyCustomX: customAmount,
          selectedBuy: customAmount,
        },
      });

      await buy.buyTrx(ctx, true);

      return;
    } else {
      try {
        const trxAmount = await fetchTrxAmountByButtonId(
          userId.toString(),
          callbackData
        );

        // await ctx.answerCallbackQuery(); // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION
        ctx.session.buyamount = trxAmount;
        const prisma = getPrismaClientSingleton();
        const updatedSettings = await prisma.settings.update({
          where: { userId: userId.toString() },
          data: {
            selectedBuy: trxAmount,
          },
        });

        await buy.buyTrx(ctx, true);
      } catch (error) {
        await ctx.reply("An error occurred while fetching your settings.");
      }
      return;
    }
  }
}

/* 
**************************************************
Buy Trx Conversation    
**************************************************
*/

bot.use(createConversation(conversation_buyTrx, "conversation_swapAmount"));
bot.callbackQuery("cb_swap_buybutton_tl", async (ctx) => {
  await ctx.conversation.enter("conversation_swapAmount");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swap_buybutton_tc", async (ctx) => {
  await ctx.conversation.enter("conversation_swapAmount");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swap_buybutton_tr", async (ctx) => {
  await ctx.conversation.enter("conversation_swapAmount");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swap_buybutton_bl", async (ctx) => {
  await ctx.conversation.enter("conversation_swapAmount");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swap_buybutton_br", async (ctx) => {
  await ctx.conversation.enter("conversation_swapAmount");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swap_buybutton_x", async (ctx) => {
  await ctx.conversation.enter("conversation_swapAmount");
  await ctx.answerCallbackQuery();
});
