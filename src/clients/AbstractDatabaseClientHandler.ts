import { User, UserSettings, UserWallet } from "../utils/types";

export abstract class AbstractDatabaseClientHandler {
    abstract createUser(
        id: string,
        username: string,
        wallet: UserWallet,
        referral?: string
    ): Promise<User | null>;

    abstract getUser(id: string): Promise<User | null>;

    abstract updateUser(
        id: string,
        data: Partial<User>
    ): Promise<User | null>;

    abstract getUserSettings(
        id: string
    ): Promise<UserSettings | null>;

    abstract updateUserSettings(
        id: string,
        data: Partial<UserSettings>
    ): Promise<UserSettings | null>;
}
