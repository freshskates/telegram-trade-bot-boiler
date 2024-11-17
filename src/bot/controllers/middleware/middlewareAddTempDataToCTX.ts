import { NextFunction } from "grammy";
import { DatabaseClientHandlerPrisma } from "../../defined/DatabaseClientHandlerPrisma";
import { BotContext } from "../../utils/util_bot";

export const middlewareAddTempDataToCTX = () => {
    return async (ctx: BotContext, next: NextFunction) => {

        ctx.temp = {
            shouldEditCurrentCTXMessage: false,
            conversationMethodReturnedANewCTX: false,
        }

        return next();
    };
};
