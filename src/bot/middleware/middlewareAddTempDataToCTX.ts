import { NextFunction } from "grammy";
import { UserClient } from "../../clients/userClient";
import { BotContext } from "../../utils";

export const middlewareAddTempDataToCTX = () => {
    return async (ctx: BotContext, next: NextFunction) => {

        ctx.temp = {
            selectedswapBuyAmountUpdated: false
        }

        return next();
    };
};
