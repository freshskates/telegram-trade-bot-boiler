import bot from "../bot_init";
import { BotContext } from "../utils/bot_utils";
import { sell } from "./sell";

async function cb_token(ctx: BotContext) {
  if (ctx.match == null) {
    return;
  }

  const tokenAddress = ctx.match[1];
  console.log(`Token Address: ${tokenAddress}`);

  ctx.session.selectedToken = tokenAddress;

  await sell.start(ctx);
}

bot.callbackQuery(/token_(.+)_cb/, cb_token);
