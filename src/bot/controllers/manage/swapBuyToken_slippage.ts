import { createConversation } from "@grammyjs/conversations";
import getPrismaClientSingleton from "../../../services/prisma_client_singleton";
import { BotContext, BotConversation } from "../../../utils";
import bot from "../../bot_init";
import { displaySwapBuyToken } from "../../display/displaySwapBuyToken";

async function fetchSlippageByButtonId(
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
    throw new Error("Settings not found for user.");
  }

  if (buttonId === "cb_swapBuyToken_slippage") {
    return settings.slippageBuy;
  }

  return 0;
}

export async function conversation_swapBuyToken_slippage(
  conversation: BotConversation,
  ctx: BotContext
) {
  const callbackData = ctx.callbackQuery?.data;

  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  if (callbackData) {

    // Handle Custom Slippage value
    if (callbackData === "cb_swapBuyToken_slippage_x") {
      await ctx.reply(
        "Please enter the custom slippage percentage you wish to use:"
      );

      const { message } = await conversation.wait();

      const customSlippage = parseFloat(message?.text || "0");

      if (isNaN(customSlippage) || customSlippage < 0) {
        return await ctx.reply(
          "Invalid slippage value. Please enter a valid percentage."
        );
      }

      ctx.session.swapBuyToken_slippage_selected = customSlippage;

      // const prisma = getPrismaClientSingleton();
      // const updatedSettings = await prisma.settings.update({
      //   where: { userId: userId.toString() },
      //   data: {
      //     slippageBuyCustom: customSlippage, // FIXME: Why is customSlippage here???????
      //     selectedBuySlippage: customSlippage,
      //   },
      // });

      await ctx.reply(`You have selected to use ${customSlippage}% slippage.`);
      

      ctx.temp.selectedswapBuyAmountUpdated = true;
      await displaySwapBuyToken.displaySwapBuyToken(ctx);

      return;

      
    } 
    // Handle Defined Slippage value
    else {
      const slippage = await fetchSlippageByButtonId(
        userId.toString(),
        callbackData
      );

      await ctx.reply(`You have selected to use ${slippage}% slippage.`);

      const prisma = getPrismaClientSingleton();
      const updatedSettings = await prisma.settings.update({
        where: { userId: userId.toString() },
        data: {
          selectedBuySlippage: slippage,
        },
      });

      // await ctx.answerCallbackQuery(); // FIXME: TO BE LOGICALLY CORRECT, THIS SHOULD BE PLACED IN A CALLBACKQUERY NOT A CONVERSATION
      ctx.session.swapBuyToken_slippage_selected = slippage;
      ctx.temp.selectedswapBuyAmountUpdated = true;
      await displaySwapBuyToken.displaySwapBuyToken(ctx);


      return;
    }
  }
}

/* 
**************************************************
Buy Menu - Slippage Conversation
**************************************************
*/

bot.use(createConversation(conversation_swapBuyToken_slippage, "conversation_swapBuyToken_slippage"));
bot.callbackQuery("cb_swapBuyToken_slippage", async (ctx) => {
  await ctx.conversation.enter("conversation_swapBuyToken_slippage");
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("cb_swapBuyToken_slippage_x", async (ctx) => {
  await ctx.conversation.enter("conversation_swapBuyToken_slippage");
  await ctx.answerCallbackQuery();
});
