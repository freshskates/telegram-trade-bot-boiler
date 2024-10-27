import { PrismaClient, Settings, User } from "@prisma/client";
import getPrismaClientSingleton from "../services/prisma_client_singleton";
import { MonadClient } from "./monad";

const PRISMA_CLIENT = getPrismaClientSingleton();

export class UserClient {
  // FIXME: THIS NEEDS TO BE GERNALIZED, STRATEGY PATTERN THIS


  static async createUser(
    id: string,
    username: string,
    referral?: string
  ): Promise<User | null> {
    try {

      const wallet = await MonadClient.createWallet();

      const user = await PRISMA_CLIENT.user.create({
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

  static async getUser(id: string): Promise<User | null> {
    try {

      const user = await PRISMA_CLIENT.user.findUnique({
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

  static async updateUser(id: string, data: Partial<User>): Promise<User | null>{
    try {

      const userUpdated = await PRISMA_CLIENT.user.update({
        where: {
          id: id?.toString(),
        },
        data: data
      });

      return userUpdated;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async getUserSettings(id: string): Promise<Settings | null> {
    try {

      const user = await PRISMA_CLIENT.settings.findUnique({
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

  static async updateUserSettings(id: string, data: Partial<Settings>): Promise<Settings | null>{
    try {

      const userSettingsUpdated = await PRISMA_CLIENT.settings.update({
        where: {
          id: id?.toString(),
        },
        data: data
      });

      return userSettingsUpdated;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

}
