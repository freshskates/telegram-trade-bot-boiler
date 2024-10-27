import ansiColors from "ansi-colors";
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

    console.log(
        ansiColors.bgMagenta(
            `----- START OF DEBUGGING ${date_formatted_1} -----`
        )
    );

    console.log(ansiColors.blue("Printing ctx"));
    console.log(ctx);

    console.log(ansiColors.blue("Printing ctx.session"));
    console.log(ctx.session);

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

    console.log(
        ansiColors.bgMagenta(`----- END OF DEBUGGING ${date_formatted_2} -----`)
    );

    await next();
}

export default middleware_debugger;
