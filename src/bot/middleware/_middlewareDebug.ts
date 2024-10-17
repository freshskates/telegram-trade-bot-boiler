import { NextFunction } from "grammy";
import { BotContext } from "../../utils";

async function middlewareDebugger(ctx: BotContext, next: NextFunction) {
    const date_formatted_1 = new Date()
        .toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
        .replace(",", "");

    console.log(`----- START OF DEBUGGING ${date_formatted_1} -----`);

    console.log("Printing ctx");
    console.log(ctx);
    console.log(ctx?.message?.text);

    const date_formatted_2 = new Date()
        .toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
        .replace(",", "");

    console.log(`----- END OF DEBUGGING ${date_formatted_2} -----`);

    await next();
}

export default middlewareDebugger;
