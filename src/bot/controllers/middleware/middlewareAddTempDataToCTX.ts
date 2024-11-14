import { NextFunction } from "grammy";
import { PrismaClientDatabaseHandler } from "../../defined/PrismaDatabaseClientHandler";
import { BotContext } from "../../utils/bot_utility";

export const middlewareAddTempDataToCTX = () => {
    return async (ctx: BotContext, next: NextFunction) => {

        ctx.temp = {
            selectedSwapBuyAmountUpdated: false
        }

        return next();
    };
};
