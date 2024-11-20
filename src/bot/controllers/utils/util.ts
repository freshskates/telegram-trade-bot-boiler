import { NoCallbackDataError, NoTokenAddressError } from "../../utils/error";
import {
  BotContext,
  getNewInitialSessionData as getNewInitialUserSessionData,
  UserSessionData,
} from "../../utils/util_bot";

const DUMMY_USER_SESSION_DATA: UserSessionData = getNewInitialUserSessionData();

const KEYS_OF_DUMMY_USER_SESSION_DATA: string[] = Object.keys(
    DUMMY_USER_SESSION_DATA
);

export interface UserSessionPropertyName_Data {
    userSessionDataPropertyName: keyof UserSessionData;
    userSessionDataPropertyName_VALUE: string | null;
}

/**
 * Get the UserSessionData property name and property name's VALUE from callback data
 *
 * Notes:
 *      This function can be generic but validation will be difficult
 *      Alternative type of "UserSessionData" can be 'BotContext["session"]'
 *
 * Example:
 *      Input
 *          cb_settings_swapTokenToCoin_gas_fee_VALUE_custom, cb_settings_
 *
 *      Output
 *          {
 *              userSessionDataPropertyName: "swapTokenToCoin_gas_fee_custom",
 *              userSessionDataPropertyName_VALUE: "custom"
 *          }
 *
 * @export
 * @async
 * @param {string} callbackName
 * @param {string} [prefix_of_callback_data="cb_"]
 * @returns {Promise<{
 *     userSessionDataPropertyName: keyof UserSessionData;
 *     userSessionDataPropertyName_VALUE: string | null;
 * }>}
 */
export async function getUserSessionDataPropertyNameAndVALUEFromCallbackData( // JOSEPH NOTES: THIS SHIT LOOKS DANK IN THIS LANGUAGE keyof
    callbackName: string,
    prefix_of_callback_data: string = "cb_"
): Promise<UserSessionPropertyName_Data> {
    const userSessionDataPropertyName_NoPrefix_HasVALUE = callbackName.replace(
        prefix_of_callback_data,
        ""
    );

    const match =
        userSessionDataPropertyName_NoPrefix_HasVALUE.match(/(?<=_VALUE_)(.+)/);
    const userSessionDataPropertyName_VALUE = match ? match[0] : null;

    let userSessionDataPropertyName =
        userSessionDataPropertyName_NoPrefix_HasVALUE.replace("_VALUE", "");

    if (
        !KEYS_OF_DUMMY_USER_SESSION_DATA.includes(
            userSessionDataPropertyName as keyof UserSessionData
        )
    ) {
        throw new NoTokenAddressError(`${userSessionDataPropertyName}`);
    }

    const userSessionDataPropertyName_Valid =
        userSessionDataPropertyName as keyof UserSessionData;

    return {
        userSessionDataPropertyName: userSessionDataPropertyName_Valid,
        userSessionDataPropertyName_VALUE: userSessionDataPropertyName_VALUE,
    };
}

/**
 * Get a UserSessionData property value given a CTX
 *
 * Notes:
 *      It gets uses ctx.callbackQuery
 *
 * Example:
 *      Assume
 *          ctx.session.swapTokenToCoin_gas_fee_custom = 44
 *
 *      Input
 *          cb_swapTokenToCoin_gas_fee_VALUE_custom, cb_
 *
 *      Output
 *          44
 *
 * @export
 * @async
 * @template T
 * @param {BotContext} ctx
 * @param {string} [prefix="cb_"]
 * @returns {unknown}
 */
export async function getUserSessionDataPropertyValueFromCTX<T>(
    ctx: BotContext,
    prefix: string = "cb_"
) {
    const callbackData = ctx.callbackQuery?.data;

    if (!callbackData) {
        throw new NoCallbackDataError(`${callbackData}`);
    }

    const { userSessionDataPropertyName, userSessionDataPropertyName_VALUE } =
        await getUserSessionDataPropertyNameAndVALUEFromCallbackData(
            callbackData,
            prefix
        );

    return ctx.session[userSessionDataPropertyName] as T;

    // throw new Error(`Value Undefined: ${value}`);
}
