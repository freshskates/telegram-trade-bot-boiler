import { AbstractDatabaseClientHandler } from "../../clients/AbstractDatabaseClientHandler";
import getDatabaseClientPrismaSingleton from "./DatabaseClientPrisma";
import { User, UserSettings, UserWallet } from "../../utils/types";

const PRISMA_CLIENT_SINGLETON = getDatabaseClientPrismaSingleton();

export class DatabaseClientHandlerPrisma extends AbstractDatabaseClientHandler{
    // FIXME: THIS NEEDS TO BE GERNALIZED, STRATEGY PATTERN THIS

    async createUser(
        id: string,
        username: string,
        wallet: UserWallet,
        referral?: string
    ): Promise<User | null> {
        try {

            const user = await PRISMA_CLIENT_SINGLETON.user.create({
                data: {
                    id: id?.toString(),
                    username: username,
                    walletPublicKey: wallet.walletPublicKey,
                    walletPrivateKey: wallet.walletPrivateKey,
                    referredBy: referral,
                    settings: {
                        create: {},
                    },
                },
            });

            return user
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async getUser(id: string): Promise<User | null> {
        try {
            const user = await PRISMA_CLIENT_SINGLETON.user.findUnique({
                where: {
                    id: id?.toString(),
                },
            });

            return user;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async updateUser(id: string, data: Partial<User>): Promise<User | null> {
        try {
            const userUpdated = await PRISMA_CLIENT_SINGLETON.user.update({
                where: {
                    id: id?.toString(),
                },
                data: data,
            });

            return userUpdated;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async getUserSettings(id: string): Promise<UserSettings| null> {
        try {
            const user = await PRISMA_CLIENT_SINGLETON.settings.findUnique({
                where: {
                    userId: id?.toString(),
                },
            });

            return user;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async updateUserSettings(
        id: string,
        data: Partial<UserSettings>
    ): Promise<UserSettings| null> {
        try {
            const userSettingsUpdated = await PRISMA_CLIENT_SINGLETON.settings.update({
                where: {
                    id: id?.toString(),
                },
                data: data,
            });

            return userSettingsUpdated;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
