import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { TronClient } from './src/clients/tron';
import { SwapClient } from './src/clients/swap';

async function createWallet() {
  const wallet = await TronClient.createWallet();
  console.log('New Wallet:', wallet);
}

async function checkBalance(address: string) {
  const tronClient = new TronClient();
  const balance = await tronClient.checkBalance(address);
  console.log('TRX Balance:', balance);
}

async function getTRXPrice() {
  const tronClient = new TronClient();
  const price = await tronClient.getTRXPrice();
  console.log('Current TRX Price:', price, 'USD');
}

async function checkTokenBalance(address: string, tokenContractAddress: string) {
  const tronClient = new TronClient();
  const balance = await tronClient.checkTokenBalance(address, tokenContractAddress);
  console.log('Token Balance:', balance);
}

async function withdraw(privateKey: string, toAddress: string, amount: string) {
  const tronClient = new TronClient();
  const result = await tronClient.withdraw(privateKey, toAddress, amount);
  console.log('Withdraw Result:', result);
}

async function swap(privateKey: string, fromToken: string, toToken: string, amountIn: string, recipient: string) {
  const swapClient = new SwapClient();
  const result = await swapClient.swap(privateKey, fromToken, toToken, amountIn, recipient);
  console.log('Swap Result:', result);
}

yargs(hideBin(process.argv))
  .command('create-wallet', 'Create a new Tron wallet', {}, createWallet)
  .command('check-balance', 'Check TRX balance', {
    address: {
      describe: 'The address of the wallet to check',
      type: 'string',
      demandOption: true,
    },
  }, (argv) => {
    checkBalance(argv.address);
  })
  .command('get-trx-price', 'Get the current TRX price in USD', {}, getTRXPrice)
  .command('check-token-balance', 'Check token balance', {
    address: {
      describe: 'The address of the wallet to check',
      type: 'string',
      demandOption: true,
    },
    tokenContractAddress: {
      describe: 'The contract address of the token',
      type: 'string',
      demandOption: true,
    },
  }, (argv) => {
    checkTokenBalance(argv.address, argv.tokenContractAddress);
  })
  .command('withdraw', 'Withdraw TRX to another address', {
    privateKey: {
      describe: 'The private key of the sender wallet',
      type: 'string',
      demandOption: true,
    },
    toAddress: {
      describe: 'The address to send TRX to',
      type: 'string',
      demandOption: true,
    },
    amount: {
      describe: 'The amount of TRX to send',
      type: 'string',
      demandOption: true,
    },
  }, (argv) => {
    withdraw(argv.privateKey, argv.toAddress, argv.amount);
  })
  .command('swap', 'Swap tokens using SunSwap', {
    privateKey: {
      describe: 'The private key of the user\'s wallet',
      type: 'string',
      demandOption: true,
    },
    fromToken: {
      describe: 'The address of the token to swap from',
      type: 'string',
      demandOption: true,
    },
    toToken: {
      describe: 'The address of the token to swap to',
      type: 'string',
      demandOption: true,
    },
    amountIn: {
      describe: 'The amount of the input token to swap',
      type: 'string',
      demandOption: true,
    },
    recipient: {
      describe: 'The address to receive the output token',
      type: 'string',
      demandOption: true,
    },
  }, (argv) => {
    swap(argv.privateKey, argv.fromToken, argv.toToken, argv.amountIn, argv.recipient);
  })
  .demandCommand(1, 'You need to specify at least one command')
  .help()
  .argv;
