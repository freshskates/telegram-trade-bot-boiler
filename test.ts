import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { TronClient } from "./src/clients/tron";
import { SwapClient } from "./src/clients/swap";
import { PumpClient } from "./src/clients/pump";
import { fetchTokenDetails } from "./src/utils/helpers";

async function createWallet() {
  const wallet = await TronClient.createWallet();
  console.log("New Wallet:", wallet);
}

async function checkBalance(address: string) {
  const tronClient = new TronClient();
  const balance = await tronClient.checkBalance(address);
  console.log("TRX Balance:", balance);
}

async function checkTransaction(txid: string) {
  const tronClient = new TronClient();
  const balance = await tronClient.getTransactionInfo(txid);
  console.log("TRX Balance:", balance);
}

async function getTRXPrice() {
  const tronClient = new TronClient();
  const price = await tronClient.getTRXPrice();
  console.log("Current TRX Price:", price, "USD");
}

async function fetchTokenInfo(tokenAddress: string) {
  try {
    const tokenDetails = await fetchTokenDetails(tokenAddress);
    console.log("Token Details:", tokenDetails);
  } catch (error) {
    console.error("Error testing function:", error);
  }
}

async function checkTokenBalance(
  privateKey: string,
  address: string,
  tokenContractAddress: string
) {
  const tronClient = new TronClient();
  const balance = await tronClient.checkTokenBalance(
    privateKey,
    address,
    tokenContractAddress
  );
  console.log("Token Balance:", balance);
}

async function withdraw(privateKey: string, toAddress: string, amount: string) {
  const tronClient = new TronClient();
  const result = await tronClient.withdraw(privateKey, toAddress, amount);
  console.log("Withdraw Result:", result);
}

async function swap(
  privateKey: string,
  fromToken: string,
  toToken: string,
  amountIn: string,
  slippage: number
) {
  const swapClient = new SwapClient();
  const result = await swapClient.swap(
    privateKey,
    fromToken,
    toToken,
    amountIn,
    slippage
  );
  console.log("Swap Result:", result);
}

async function pumpPurchase(
  privateKey: string,
  toToken: string,
  amountIn: string,
  slippage: number
) {
  const pumpClient = new PumpClient();
  const result = await pumpClient.pumpPurchase(
    privateKey,
    toToken,
    amountIn,
    slippage
  );
  console.log("Buy Result:", result);
}

async function pumpSell(
  privateKey: string,
  tokenAmount: number | string,
  token: string,
  slippage: number
) {
  const pumpClient = new PumpClient();
  const result = await pumpClient.pumpSellToken(
    privateKey,
    tokenAmount,
    token,
    slippage
  );
  console.log("Sell Result:", result);
}

yargs(hideBin(process.argv))
  .command("create-wallet", "Create a new Tron wallet", {}, createWallet)
  .command(
    "check-balance",
    "Check TRX balance",
    {
      address: {
        describe: "The address of the wallet to check",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      checkBalance(argv.address);
    }
  )
  .command(
    "token-info",
    "Fetch Token Info",
    {
      tokenAddress: {
        describe: "The token CA for the token you need info on",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      fetchTokenInfo(argv.tokenAddress);
    }
  )
  .command(
    "check-tx",
    "Check tx",
    {
      txid: {
        describe: "The txid to check",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      checkTransaction(argv.txid);
    }
  )
  .command("get-trx-price", "Get the current TRX price in USD", {}, getTRXPrice)
  .command(
    "check-token-balance",
    "Check token balance",
    {
      privateKey: {
        describe: "Private key of the wallet to check",
        type: "string",
        demandOption: true,
      },
      address: {
        describe: "The address of the wallet to check",
        type: "string",
        demandOption: true,
      },
      tokenContractAddress: {
        describe: "The contract address of the token",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      checkTokenBalance(
        argv.privateKey,
        argv.address,
        argv.tokenContractAddress
      );
    }
  )
  .command(
    "withdraw",
    "Withdraw TRX to another address",
    {
      privateKey: {
        describe: "The private key of the sender wallet",
        type: "string",
        demandOption: true,
      },
      toAddress: {
        describe: "The address to send TRX to",
        type: "string",
        demandOption: true,
      },
      amount: {
        describe: "The amount of TRX to send",
        type: "string",
        demandOption: true,
      },
    },
    (argv) => {
      withdraw(argv.privateKey, argv.toAddress, argv.amount);
    }
  )
  .command(
    "swap",
    "Swap tokens using SunSwap",
    {
      privateKey: {
        describe: "The private key of the user's wallet",
        type: "string",
        demandOption: true,
      },
      fromToken: {
        describe: "The address of the token to swap from",
        type: "string",
        demandOption: true,
      },
      toToken: {
        describe: "The address of the token to swap to",
        type: "string",
        demandOption: true,
      },
      amountIn: {
        describe: "The amount of the input token to swap",
        type: "string",
        demandOption: true,
      },
      slippage: {
        describe: "slippage amount",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      swap(
        argv.privateKey,
        argv.fromToken,
        argv.toToken,
        argv.amountIn,
        argv.slippage
      );
    }
  )

  .command(
    "buy-pump",
    "Buy tokens using SunPump",
    {
      privateKey: {
        describe: "The private key of the user's wallet",
        type: "string",
        demandOption: true,
      },
      toToken: {
        describe: "The address of the token to buy",
        type: "string",
        demandOption: true,
      },
      amountIn: {
        describe: "The amount of tokens to buy",
        type: "string",
        demandOption: true,
      },
      slippage: {
        describe: "slippage amount",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      pumpPurchase(argv.privateKey, argv.toToken, argv.amountIn, argv.slippage);
    }
  )

  .command(
    "sell-pump",
    "sell tokens using SunPump",
    {
      privateKey: {
        describe: "The private key of the user's wallet",
        type: "string",
        demandOption: true,
      },
      amount: {
        describe: "The amount of tokens to sell",
        type: "string",
        demandOption: true,
      },
      token: {
        describe: "The CA of the token on pump",
        type: "string",
        demandOption: true,
      },
      slippage: {
        describe: "slippage amount",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      pumpSell(argv.privateKey, argv.amount, argv.token, argv.slippage);
    }
  )
  .demandCommand(1, "You need to specify at least one command")
  .help().argv;
