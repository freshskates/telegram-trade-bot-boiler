import { NextFunction } from "grammy";
import { BotContext } from "../../utils";

async function middleware_debugger(ctx: BotContext, next: NextFunction) {
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

export default middleware_debugger;
