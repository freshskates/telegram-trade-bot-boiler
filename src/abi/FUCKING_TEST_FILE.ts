import bot from "../bot/bot_init";
import { BotContext } from "../utils";

// ------- FOR TESTING -------

export async function _TEST_FUNCTION(ctx: BotContext) {
    console.log("FROM message:text");
    console.log("ctx");
    console.log(ctx);
    console.log("ctx.session");
    console.log(ctx.session);

    //@ts-ignore
    ctx.reply(ctx.message.text);  
}
bot.on("message:text", _TEST_FUNCTION);

console.log("FUCKING TESTING IMPORTED");

const TEST_VAR = 2;
export default TEST_VAR;
