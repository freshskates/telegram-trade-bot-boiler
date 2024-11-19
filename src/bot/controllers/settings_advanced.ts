import bot from "../bot_init";
import getBotShared from "../defined/BotShared";
import { BotContext } from "../utils/util_bot";
import settings from "./settings";
import {
    getGrammyUser,
    getTokenAddress,
    getUserSettings,
} from "./utils/common";

async function settings_advnaced_(ctx: BotContext) {
    const grammyUser = await getGrammyUser(ctx);

    // const userId = ctx.update.callback_query?.from.id;
    const grammyUserId = grammyUser.id;

    // ANY TOKEN RELATED STUFF SHOULD NOT BE IN SETTINGS BECAUSE THE USER CAN CHANGE TO ANY TOKEN
    // const tokenInformation = await getBotShared()
    //     .getTokenClient()
    //     .getTokenInformation(tokenAddress);

    const coinInformation = await getBotShared().getCoinInformation();

    const userSettings = await getUserSettings(grammyUserId);

    const ctx_session_cached = ctx.session;

    await ctx.reply(
        `
Advanced Settings
    `,
        {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Back",
                            callback_data: "cb_settings",
                        },
                        {
                            text: "Reset Settings",
                            callback_data: "cb_settings_reset_settings",
                        },
                    ],
                ],
            },
        }
    );
}

async function settings_reset_settings_(ctx: BotContext) {
    ctx.session = null
    await ctx.reply("Settings Reset")
}

async function cb_settings_reset_settings(ctx: BotContext) {
    // await ctx.conversation.exit(); // Exit any exist conversation to prevent buggy behavior

    await settings_reset_settings_(ctx);
    await ctx.answerCallbackQuery();

    await settings_advnaced_(ctx);
    await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_settings_reset_settings", cb_settings_reset_settings);

async function cb_settings_advanced(ctx: BotContext) {
    // await ctx.conversation.exit(); // Exit any exist conversation to prevent buggy behavior

    await settings_advnaced_(ctx);
    await ctx.answerCallbackQuery();
}

bot.callbackQuery("cb_settings_advanced", cb_settings_advanced);
