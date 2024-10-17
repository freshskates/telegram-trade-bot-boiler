
import "dotenv/config";
import { TronClient } from "../../clients/tron";
import bot from "../bot_init";
import { BotContext } from "../utils/utils";


function _createTokenInlineKeyboard(tokens: any[]) {
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
        const formatTokenSymbol = tokens[i].tokenSymbol.slice(0, 4);
        const formatTokenAddress = `${tokens[i].tokenAddress.slice(
            0,
            3
        )}...${tokens[i].tokenAddress.slice(-2)}`;

        row.push({
            text: `${formatTokenSymbol} - ${formatTokenAddress}`,
            callback_data: `token_${tokens[i].tokenAddress}_cb`,
        });

        if (i + 1 < tokens.length) {
            const formatTokenSymbolNext = tokens[i + 1].tokenSymbol.slice(0, 4);
            const formatTokenAddressNext = `${tokens[i + 1].tokenAddress.slice(
                0,
                3
            )}...${tokens[i + 1].tokenAddress.slice(-2)}`;

            row.push({
                text: `${formatTokenSymbolNext} - ${formatTokenAddressNext}`,
                callback_data: `token_${tokens[i + 1].tokenAddress}_cb`,
            });
        }

        inlineKeyboard.push(row);
    }

    return inlineKeyboard;
}

async function cb_tokens_owned(ctx: BotContext) {
    const userId = ctx.from?.id;

    if (!userId) {
        return;
    }

    const walletPb = ctx.session.user.walletPb;
    const tokensOwned = await TronClient.getTokensOwned(walletPb);

    console.log("tokensOwned");
    console.log(tokensOwned);

    const inlineKeyboard = [
        [
            {
                text: "Back",
                callback_data: "callback__root__back",
            },
            {
                text: "Refresh",
                callback_data: "refresh_cb_tokens_owned",
            },
        ],
        ..._createTokenInlineKeyboard(tokensOwned),
        [
            {
                text: "Prev Page",
                callback_data: "prev_page_cb",
            },
            {
                text: "Next Page",
                callback_data: "next_page_cb",
            },
        ],
    ];

    await ctx.reply(
        `
Select a token to sell ${tokensOwned.length}/${tokensOwned.length}
    `,
        {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: inlineKeyboard,
            },
        }
    );
}
bot.callbackQuery("cb_tokens_owned", cb_tokens_owned);

// @ts-ignore
// console.log(`${new URL(import.meta.url).pathname} Module Loaded `); // Check to see if this file is loaded
