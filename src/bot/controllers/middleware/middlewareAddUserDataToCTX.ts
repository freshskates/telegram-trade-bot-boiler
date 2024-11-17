import { NextFunction } from "grammy";
import getBotShared from "../../defined/BotShared";
import {
    NoAuthorError,
    UserDoesNotExistError,
    UserSettingsDoesNotExistError,
} from "../../utils/error";
import { BotContext } from "../../utils/util_bot";
import { getGrammyUser as getGrammyUser, getUserSettings } from "../utils/common";

// TODO: YOU NEED TO CHECK IF THIS MIDDLEWARE WORKS PROPERLY BY DELETING THE USER

export const middlewareAddUserDataToCTX = () => {
    return async (ctx: BotContext, next: NextFunction) => {

        const grammyUser = await getGrammyUser(ctx)

        const grammyUserId = grammyUser.id;

        // If UserID Exists, get User
        let user = await getBotShared()
            .getDatabaseClientHandler()
            .getUser(grammyUserId.toString());

        // Create user if not exists
        if (!user) {
            const referral = ctx.message?.text?.split("?r=")[1]?.trim();

            const userWallet = await getBotShared() // TODO: Make a function that creates the User, UserSettings, and UserWallet at the same time or some shit... then return all 3
                .getCoinClient()
                .createCoinWallet();

            user = await getBotShared()
                .getDatabaseClientHandler()
                .createUser(
                    grammyUserId.toString(),
                    ctx.message?.from.username || "anon",
                    userWallet,
                    referral
                );
        }

        if (!user) {
            throw new UserDoesNotExistError(`${user}`);
        }

        const userData = {
            walletPrivateKey: user.walletPrivateKey,
            walletPublicKey: user.walletPublicKey,
        };

        // UserID's Settings
        const settingsData = await getUserSettings(grammyUserId);

        ctx.user = { user: userData, settings: settingsData };

        return next();
    };
};
