import { NextFunction } from "grammy";
import { UserClient } from "../../clients/userClient";
import { BotContext } from "../../utils";

export const middlewareAddUserDataToCTX = () => {
    return async (ctx: BotContext, next: NextFunction) => {
        const userId = ctx.from?.id;


        // User does not exist via UserID
        if (!userId) {
            return next();
        }

        // UserID Exists, user may not
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
        
        const userData = {
            walletPk: user.walletPk,
            walletPb: user.walletPb,
        };

        // UserID's Settings
        const settings = await UserClient.getUserSettings(userId.toString());

        if (!settings) {
            return next();
        }

        const settingsData = {
            gasFee: settings.gasFee,  //FIXME: WHY ARE GAS FEES PER USER???????????????
            autoBuy: settings.autoBuy,
            autoBuyTrx: settings.autoBuyTrx,
        };

        ctx.user = {user: userData, settings: settingsData}


        console.log("Printing ctx.session");
        console.log(ctx.session);

        return next();
    };
};
