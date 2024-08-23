import { NextFunction } from "grammy";
import { BotContext } from "../utils";
import { UserClient } from "../clients/user";

export const userSessionMiddleware = () => {
  return async (ctx: BotContext, next: NextFunction) => {
    const userId = ctx.from?.id;

    if (!userId) {
      return next();
    }

    const user = await UserClient.getUser(userId.toString());

    if (!user) {
      const referral = ctx.message?.text?.split("?r=")[1]?.trim();

      await UserClient.createUser(
        userId.toString(),
        ctx.message?.from.username || "anon",
        referral
      );

      return next();
    }

    ctx.session.user = user;

    const settings = await UserClient.getUserSettings(userId.toString());

    if (!settings) {
      return next();
    }

    ctx.session.settings = {
      gasFee: settings.gasFee,
      autoBuy: settings.autoBuy,
      autoBuyTrx: settings.autoBuyTrx,
    };

    console.log("ctx.session");
    console.log(ctx.session);

    return next();
  };
};
