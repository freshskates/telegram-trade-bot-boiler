import { PrismaClient, Settings, User } from "@prisma/client";
import { TronClient } from "./tron";
import getPrismaClientSingleton from "../services/prisma_client_singleton";

export class UserClient {
    // FIXME: THIS NEEDS TO BE GERNALIZED, STRATEGY PATTERN THIS
    static async getUser(id: string): Promise<User | null> {
        try {
            const prisma = getPrismaClientSingleton();

            const user = await prisma.user.findUnique({
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

    static async createUser(
        id: string,
        username: string,
        referral?: string
    ): Promise<User | null> {
        try {
            const prisma = getPrismaClientSingleton();

            const wallet = await TronClient.createWallet();

            const user = await prisma.user.create({
                data: {
                    id: id?.toString(),
                    username: username,
                    walletPb: wallet.address.base58,
                    walletPk: wallet.privateKey,
                    referredBy: referral,
                    settings: {
                        create: {},
                    },
                },
            });

            return user;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async getUserSettings(id: string): Promise<Settings | null> {
        try {
            const prisma = getPrismaClientSingleton();

            const user = await prisma.settings.findUnique({
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
}
