import { NextFunction } from "grammy";
import { DatabaseClientHandlerPrisma } from "../../defined/DatabaseClientHandlerPrisma";
import { BotContext } from "../../utils/bot_utility";

export const middlewareAddTempDataToCTX = () => {
    return async (ctx: BotContext, next: NextFunction) => {

        ctx.temp = {
            shouldEditCurrentCTXMessage: false,
            conversationMethodReturnedANewCTX: false,
        }

        return next();
    };
};
