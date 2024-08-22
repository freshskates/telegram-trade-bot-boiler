// Import required libraries
const TronWeb = require('tronweb');

// Define constants
const TRONGRID_URL = 'https://api.trongrid.io'; // TronGrid API URL
const PRIVATE_KEY = '13b951e6e95b20cb754e0a479c441955ee096b1a6b2489bc04f8c8fdbb96423b'; // Replace with your private key
const ADDRESS = 'TAfL5Pw7y3RJXaUJdBjmzkGa7ZdNLmk56i'; // Replace with the Tron address you want to query

// Initialize TronWeb instance
const tronWeb = new TronWeb({
  fullHost: TRONGRID_URL,
  headers: { 'TRON-PRO-API-KEY': '1ae3bab7-b375-4df8-976a-86c46b623fbf' }, // Replace with your TronGrid API key
  privateKey: PRIVATE_KEY,
});

// Function to get and display balance
async function getBalance(address) {
  try {
    // Fetch balance
    const balance = await tronWeb.trx.getBalance(address);
    console.log(`Balance for address ${address}: ${balance}`);
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}

// Execute the function
getBalance(ADDRESS);
