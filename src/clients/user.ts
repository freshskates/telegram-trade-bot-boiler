import { PrismaClient, Settings, User } from "@prisma/client";
import getPrismaClientSingleton from "../services/prisma_client_singleton";
import { MonadClient } from "./monad";

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

      const wallet = await MonadClient.createWallet();

      const user = await prisma.user.create({
        data: {
          id: id?.toString(),
          username: username,
          walletPb: wallet.publicKey,
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
