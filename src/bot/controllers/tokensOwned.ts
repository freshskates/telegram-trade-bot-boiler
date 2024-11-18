import "dotenv/config";
import { UserTokenPosition } from "../../utils/types";
import bot from "../bot_init";
import getBotShared from "../defined/BotShared";
import { BotContext } from "../utils/util_bot";

// TODO: FIX THIS SHIT, LOOKS UGLY
function _createTokenInlineKeyboard(tokens: UserTokenPosition[]) {
    const maxRows = 6;
    const inlineKeyboard = [];

    // Add the dynamic token buttons
    for (
        let i = 0;
        i < tokens.length && inlineKeyboard.length < maxRows;
        i += 2
    ) {
        const row = [];

        // Format token symbol and address
        const formatTokenSymbol = tokens[i].ticker.slice(0, 4);
        const formatTokenAddress = `${tokens[i].address.slice(0, 3)}...${tokens[
            i
        ].address.slice(-2)}`;

        row.push({
            text: `${formatTokenSymbol} - ${formatTokenAddress}`,
            callback_data: `cb_sTTC_ADDRESS_${tokens[i].address}`,
        });

        if (i + 1 < tokens.length) {
            const formatTokenSymbolNext = tokens[i + 1].ticker.slice(0, 4);
            const formatTokenAddressNext = `${tokens[i + 1].address.slice(
                0,
                3
            )}...${tokens[i + 1].address.slice(-2)}`;

            row.push({
                text: `${formatTokenSymbolNext} - ${formatTokenAddressNext}`,
                callback_data: `cb_sTTC_ADDRESS_${tokens[i + 1].address}`,
            });
        }

        inlineKeyboard.push(row);
    }

    return inlineKeyboard;
}

// TODO: FIX THIS SHIT (IMPLEMENT THE FUNCTIONS)
async function tokensOwned_(ctx: BotContext){
    const walletPublicKey = ctx.user.user.walletPublicKey;

    const tokensOwned_walletPublicKey = await getBotShared()
        .getWalletClient()
        .getOwnedTokens(walletPublicKey);

    const inlineKeyboard = [
        [
            {
                text: "Home",
                callback_data: "cb_root_home",
            },
            {
                text: "Refresh",
                callback_data: "cb_tokensOwned_refresh",
            },
        ],
        ..._createTokenInlineKeyboard(tokensOwned_walletPublicKey),
        [
            {
                text: "Prev Page",
                callback_data: "cb_tokensOwned_page_previous",  // TODO: IMPLEMENT IDK
            },
            {
                text: "Next Page",
                callback_data: "cb_tokensOwned_page_next", // TODO: IMPLEMENT IDK
            },
        ],
    ];

    await ctx.reply(`
Select a token to sell ${tokensOwned_walletPublicKey.length}/${tokensOwned_walletPublicKey.length}
    `,
        {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: inlineKeyboard,
            },
        }
    );
}

async function cb_tokensOwned_refresh(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any exist conversation to prevent buggy behavior
    await ctx.deleteMessage();  // Delete the most recent message relative to where this method was called
    await ctx.answerCallbackQuery(); // Answer any existing callback_query to prevent buggy behavior

    await tokensOwned_(ctx);
    await ctx.answerCallbackQuery();
}
bot.callbackQuery("cb_tokensOwned_refresh", cb_tokensOwned_refresh);

async function cb_tokensOwned(ctx: BotContext) {
    await ctx.conversation.exit(); // Exit any existing conversation to prevent buggy behavior

    await tokensOwned_(ctx)
    await ctx.answerCallbackQuery();

}
bot.callbackQuery("cb_tokensOwned", cb_tokensOwned);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
