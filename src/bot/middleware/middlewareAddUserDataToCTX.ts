import { NextFunction } from "grammy";
import { BotContext } from "../../utils";
import { UserClient } from "../../clients/user";

export const middlewareAddUserDataToCTX = () => {
  return async (ctx: BotContext, next: NextFunction) => {
    const userId = ctx.from?.id;
    

    /* 
    **************************************************
    User does not exist via UserID
    **************************************************
    */

    if (!userId) {
      return next();
    }

    /* 
    **************************************************
    UserID Exists
    **************************************************
    */

    const user = await UserClient.getUser(userId.toString());

    // Check if user exists
    if (!user) {
      const referral = ctx.message?.text?.split("?r=")[1]?.trim();

      await UserClient.createUser(
        userId.toString(),
        ctx.message?.from.username || "anon",
        referral
      );

      return next();
    }

    /* 
    **************************************************
    User Exists
    **************************************************
    */

    // Attach user to session
    ctx.session.user = user;

    /* 
    **************************************************
    UserID's Settings
    **************************************************
    */
    const settings = await UserClient.getUserSettings(userId.toString());

    if (!settings) {
      return next();
    }

    // Attach user's settings
    ctx.session.settings = {
      gasFee: settings.gasFee,
      autoBuy: settings.autoBuy,
      autoBuyTrx: settings.autoBuyTrx,
    };

    console.log("Printing ctx.session");
    console.log(ctx.session);

    return next();
  };
};
