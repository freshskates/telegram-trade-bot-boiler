import { NextFunction } from "grammy";
import { PrismaClientDatabaseHandler } from "../../defined/PrismaDatabaseClientHandler";
import getBotSharedSingleton from "../../defined/BotShared";
import { BotContext } from "../../utils/bot_utility";

export const middlewareAddUserDataToCTX = () => {
    return async (ctx: BotContext, next: NextFunction) => {
        const userId = ctx.from?.id;


        // User does not exist via UserID
        if (!userId) {
            return next();
        }

        // UserID Exists, user may not
        const user = await getBotSharedSingleton().getDatabaseClientHandler().getUser(userId.toString());

        // Create user if not exists
        if (!user) {
            const referral = ctx.message?.text?.split("?r=")[1]?.trim();
            
            const userWallet = await getBotSharedSingleton().getCoinClient().createCoinWallet();
            
            await getBotSharedSingleton().getDatabaseClientHandler().createUser(
                userId.toString(),
                ctx.message?.from.username || "anon",
                userWallet,
                referral
            );

            return next(); // WARNING: IS THIS REALLY WHAT YOU WANT TO DO
        }
        
        const userData = {
            walletPrivateKey: user.walletPrivateKey,
            walletPublicKey: user.walletPublicKey,
        };

        // UserID's Settings
        const settings = await getBotSharedSingleton().getDatabaseClientHandler().getUserSettings(userId.toString());

        if (!settings) {
            return next();  // WARNING: IS THIS REALLY WHAT YOU WANT TO DO
        }

        const settingsData = {
            
        };

        ctx.user = {user: userData, settings: settingsData}

        return next();
    };
};
