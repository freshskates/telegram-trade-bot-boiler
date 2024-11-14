import "dotenv/config";
import { UserTokenPosition } from "../../../utils/types";
import bot from "../../bot_init";
import getBotShared from "../../defined/BotShared";
import { BotContext } from "../../utils/bot_utility";

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
        const formatTokenSymbol = tokens[i].symbol.slice(0, 4);
        const formatTokenAddress = `${tokens[i].address.slice(0, 3)}...${tokens[
            i
        ].address.slice(-2)}`;

        row.push({
            text: `${formatTokenSymbol} - ${formatTokenAddress}`,
            callback_data: `token_${tokens[i].address}_cb`,
        });

        if (i + 1 < tokens.length) {
            const formatTokenSymbolNext = tokens[i + 1].symbol.slice(0, 4);
            const formatTokenAddressNext = `${tokens[i + 1].address.slice(
                0,
                3
            )}...${tokens[i + 1].address.slice(-2)}`;

            row.push({
                text: `${formatTokenSymbolNext} - ${formatTokenAddressNext}`,
                callback_data: `token_${tokens[i + 1].address}_cb`,
            });
        }

        inlineKeyboard.push(row);
    }

    return inlineKeyboard;
}

async function cb_tokensOwned(ctx: BotContext) {
    const walletPublicKey = ctx.user.user.walletPublicKey;
    const tokensOwned = await getBotShared()
        .getWalletClient()
        .getOwnedTokens(walletPublicKey);

    const inlineKeyboard = [
        [
            {
                text: "Back",
                callback_data: "cb_root",
            },
            {
                text: "Refresh",
                callback_data: "refresh_cb_tokens_owned",
            },
        ],
        ..._createTokenInlineKeyboard(tokensOwned.tokens),
        [
            {
                text: "Prev Page",
                callback_data: "cb_prev_page",
            },
            {
                text: "Next Page",
                callback_data: "next_page_cb",
            },
        ],
    ];

    await ctx.reply(
        `
Select a token to sell ${tokensOwned.tokens.length}/${tokensOwned.tokens.length}
    `,
        {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: inlineKeyboard,
            },
        }
    );
}
bot.callbackQuery("cb_tokensOwned", cb_tokensOwned);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
