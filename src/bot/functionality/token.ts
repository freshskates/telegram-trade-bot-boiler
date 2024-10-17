import bot from "../bot_init";
import { BotContext } from "../utils/utils";
import { sell } from "./sell";


async function cb_token (ctx: BotContext) {
    const tokenAddress = ctx.match[1]; // Extract tokenAddress from the callback data
    console.log(`Token Address: ${tokenAddress}`);

    // You can then handle the logic based on the tokenAddress
    ctx.session.selectedToken = tokenAddress;

    await sell.start(ctx);
}


bot.callbackQuery(/token_(.+)_cb/, cb_token);