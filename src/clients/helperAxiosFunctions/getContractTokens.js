const axios = require("axios");

const address = 'TUFonyWZ4Tza5MzgDj6g2u5rfdGoRVYG7g'; //Fofar hard code

const TRONGRID_API_KEY = "1ae3bab7-b375-4df8-976a-86c46b623fbf";
const TRONGRID_URL = "https://api.trongrid.io";

async function getContractTokens(contractAddress) {
  try {
    const url = `${TRONGRID_URL}/v1/contracts/${contractAddress}/tokens`;
    const response = await axios.get(url, { headers });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching contract tokens:", error.message);
    return null;
  }
}

const headers = {
  Accept: "application/json",
  "TRON-PRO-API-KEY": TRONGRID_API_KEY,
};

getContractTokens(address);
