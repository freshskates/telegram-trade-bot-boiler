import { ERC20_ABI } from "../abi/erc20_abi";
import axios from 'axios';

export async function estimateGasFee(
  tronWeb: any,
  smartRouterAddress: string,
  transactionParams: any,
): Promise<number> {
  try {
    const { paths, poolVersions, versionLen, fees, data } = transactionParams;

    const estimatedGas =
      await tronWeb.transactionBuilder.triggerConstantContract(
        smartRouterAddress,
        "swapExactInput(address[],string[],uint256[],uint24[],tuple(uint256,uint256,address,uint256))",
        {},
        [
          { type: "address[]", value: paths },
          { type: "string[]", value: poolVersions },
          { type: "uint256[]", value: versionLen },
          { type: "uint24[]", value: fees },
          { type: "tuple(uint256,uint256,address,uint256)", value: data },
        ],
      );

    const energyUsed = estimatedGas.energy_used;
    const netUsed = estimatedGas.net_usage;
    const energyPrice = await tronWeb.trx.getEnergyFee();

    // Calculate estimated fee
    const fee = energyUsed * energyPrice + netUsed;

    console.log("Estimated Fee:", fee);
    return fee;
  } catch (error) {
    console.error("Error estimating gas fee:", error);
    throw error;
  }
}

export async function getSwapRoute(
  routerApiUrl: string,
  fromToken: string,
  toToken: string,
  amountInSun: string,
): Promise<any> {
  try {
    const apiUrl = `${routerApiUrl}?fromToken=${fromToken}&toToken=${toToken}&amountIn=${amountInSun}&typeList=PSM,CURVE,CURVE_COMBINATION,WTRX,SUNSWAP_V2`;
    console.log("API Request URL:", apiUrl);
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.code !== 0) {
      throw new Error(`Error fetching swap route: ${data.message}`);
    }

    if (!data.data || data.data.length === 0) {
      throw new Error("No valid swap route found.");
    }

    return data.data[0];
  } catch (error) {
    console.error("Error getting swap route:", error);
    throw error;
  }
}

export async function getTokenDecimals(
  tronWeb: any,
  tokenAddress: string,
): Promise<number> {
  const TRX_ADDRESS = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";
  try {
    if (tokenAddress === TRX_ADDRESS) {
      return 6; // TRX uses 6 decimals
    }

    // Get the contract instance with the correct ABI
    const contract = await tronWeb.contract(ERC20_ABI, tokenAddress);

    // Call the decimals method on the contract
    const decimals = await contract.decimals().call();
    console.log(decimals);
    return parseInt(decimals, 10);
  } catch (error) {
    console.error("Error getting token decimals:", error);
    throw error;
  }
}

export async function approveToken(
  tronWeb: any,
  smartRouterAddress: string,
  tokenAddress: string,
  amount: string,
) {
  try {
    const contract = await tronWeb.contract(ERC20_ABI, tokenAddress);
    const result = await contract.methods
      .approve(smartRouterAddress, amount)
      .send();
    console.log("Token approved:", result);

    // Wait for 2 seconds to ensure the transaction is processed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return result;
  } catch (error) {
    console.error("Error during token approval:", error);
    throw error;
  }
}

export async function fetchPumpTokenPrice(tokenAddress: string): Promise<number> {
    const apiUrl = `https://api-v2.sunpump.meme/pump-api/token/${tokenAddress}`;
    try {
      const response = await axios.get(apiUrl);
      console.log(response.data)
      if (response.data && response.data.data.priceInTrx) {
        return parseFloat(response.data.data.priceInTrx);
      } else {
        throw new Error("Token price not found in API response");
      }
    } catch (error) {
      console.error("Error fetching token price:", error);
      throw error;
    }
  }