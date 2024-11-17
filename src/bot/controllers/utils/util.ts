import {
    NoTokenAddressError,
    NoCallbackDataError,
} from "../../utils/error";
import {
    BotContext,
    getNewInitialSessionData as getNewInitialUserSessionData,
    UserSessionData,
} from "../../utils/util_bot";

const EXAMPLE_USER_SESSION_DATA: UserSessionData =
    getNewInitialUserSessionData();
// Validate and assert the type
const KEYS_OF_EXAMPLE_USER_SESSION_DATA: string[] = Object.keys(
    EXAMPLE_USER_SESSION_DATA
);

/**
 * Description placeholder
 *
 * Notes:
 *      This function can be generic but validation will be difficult
 *      Alternative type of "UserSessionData" can be 'BotContext["session"]'
 *
 * @export
 * @async
 * @param {string} callbackName
 * @param {string} [prefix="cb_"]
 * @returns {Promise<{
 *     userSessionDataPropertyName: keyof UserSessionData;
 *     userSessionDataPropertyName_VALUE: string | null;
 * }>}
 */
export async function getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData( // JOSEPH NOTES: THIS SHIT LOOKS DANK IN THIS LANGUAGE keyof
    callbackName: string,
    prefix: string = "cb_"
): Promise<{
    userSessionDataPropertyName: keyof UserSessionData;
    userSessionDataPropertyName_VALUE: string | null;
}> {
    const userSessionDataPropertyName_NoPrefix_HasVALUE = callbackName.replace(
        prefix,
        ""
    );

    const match =
        userSessionDataPropertyName_NoPrefix_HasVALUE.match(/(?<=_VALUE_)(.+)/);
    const userSessionDataPropertyName_VALUE = match ? match[0] : null;

    let userSessionDataPropertyName =
        userSessionDataPropertyName_NoPrefix_HasVALUE.replace("_VALUE", "");

    if (
        !KEYS_OF_EXAMPLE_USER_SESSION_DATA.includes(
            userSessionDataPropertyName as keyof UserSessionData
        )
    ) {
        throw new NoTokenAddressError(
            `${userSessionDataPropertyName}`
        );
    }

    const userSessionDataPropertyName_Valid =
        userSessionDataPropertyName as keyof UserSessionData;

    return {
        userSessionDataPropertyName: userSessionDataPropertyName_Valid,
        userSessionDataPropertyName_VALUE: userSessionDataPropertyName_VALUE,
    };
}

export async function getUserSessionDataPropertyValueFromCTX<
    T extends string | number | boolean
>(ctx: BotContext): Promise<T> {
    const callbackData = ctx.callbackQuery?.data;

    if (!callbackData) {
        throw new NoCallbackDataError(`${callbackData}`);
    }

    const { userSessionDataPropertyName, userSessionDataPropertyName_VALUE } =
        await getUserSessionDataPropertyNameAndPropertyNameVALUEFromCallbackData(
            callbackData
        );

    const value: string | number | boolean | undefined =
        ctx.session[userSessionDataPropertyName];

    if (typeof value === "string") {
        return value as T;
    } else if (typeof value === "number" && !isNaN(value)) {
        return value as T;
    } else if (typeof value === "boolean") {
        return value as T;
    }

    throw new Error(`Value Undefined: ${value}`);
}
