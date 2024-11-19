import { User } from "grammy/types";
import { formatNumber } from "../../../utils/menu_helpers/homedata";
import { UserSettings } from "../../../utils/types";
import getBotShared from "../../defined/BotShared";
import {
    NoCallbackDataError,
    NoAuthorError as NoGrammyUserError,
    NoTokenAddressError,
    UserSettingsDoesNotExistError,
} from "../../utils/error";
import { BotContext } from "../../utils/util_bot";
import { FormatAndValidateInput } from "./types";

export async function getTokenHeaderFormatted(
    ctx: BotContext,
    tokenAddress: string,
    headerLineFirst: string
): Promise<string> {
    const tokenMarketDetails = await getBotShared()
        .getTokenClient()
        .getTokenMarketDetails(tokenAddress);
    const walletBalance = await getBotShared()
        .getCoinClient()
        .getCoinWalletBalance(ctx.user.user.walletPublicKey);

    const headerTextComplete = `
${headerLineFirst} [${tokenMarketDetails.name}](${
        tokenMarketDetails.URL_dexscreener
    }) [📉](${tokenMarketDetails.URL_dexscreener}) 
\`${tokenAddress}\`
  
Balance: *${walletBalance.coinBalance} ${
        getBotShared().getCoinInformation().name
    }* 
Price: *\$${formatNumber(
        tokenMarketDetails.priceInUsd
    )}* — VOL: *\$${formatNumber(
        tokenMarketDetails.volume24h
    )}* — MC: *\$${formatNumber(tokenMarketDetails.marketCap)}*
  
// insert quote details here
        `;

    return headerTextComplete;
}

export async function getTokenAddress(ctx: BotContext): Promise<string> {
    const tokenAddress = ctx.session.tokenAddress_selected;

    if (!tokenAddress) {
        throw new NoTokenAddressError(`${tokenAddress}`);
    }
    return tokenAddress;
}
export async function getCallbackData(ctx: BotContext): Promise<string> {
    const callbackData = ctx.callbackQuery?.data;

    if (!callbackData) {
        throw new NoCallbackDataError(`${callbackData}`);
    }
    return callbackData;
}

export async function getGrammyUser(ctx: BotContext): Promise<User> {
    const grammyUser = ctx.from;

    if (!grammyUser) {
        throw new NoGrammyUserError(`${grammyUser}`);
    }

    return grammyUser;
}

export async function getUserSettings(
    grammyUserId: number
): Promise<UserSettings> {
    const userSettings = await getBotShared()
        .getDatabaseClientHandler()
        .getUserSettings(grammyUserId.toString());

    if (!userSettings) {
        throw new UserSettingsDoesNotExistError(`${grammyUserId}`);
    }
    return userSettings;
}

export const formatAndValidateInput_number_greater_than_or_equal_to_0: FormatAndValidateInput<
    number
> = async (input: string | undefined, default_value: string = "0") => {

    // Triple check if not null/undefined/empty string: Use input else use default_value else use "0"
    const amount = parseFloat(input || default_value || "0");

    if (isNaN(amount) || amount < 0) {
        return { resultFormattedValidated: null, isResultValid: false };
    }

    return { resultFormattedValidated: amount, isResultValid: true };
};

export const formatAndValidateInput_number_between_0_and_100: FormatAndValidateInput<
    number
> = async (input: string | undefined, default_value: string = "0") => {

    // Triple check if not null/undefined/empty string: Use input else use default_value else use "0"
    const amount = parseFloat(input || default_value || "0");

    if (isNaN(amount) || amount < 0 || amount > 100) {
        return { resultFormattedValidated: null, isResultValid: false };
    }

    return { resultFormattedValidated: amount, isResultValid: true };
};
