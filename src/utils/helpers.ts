export async function estimateGasFee(
  tronWeb: any,
  smartRouterAddress: string,
  transactionParams: any
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
        ]
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
  amountInSun: string
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

export function calculateMinimumOutput(
  amountOut: string,
  slippage: number,
  toTokenDecimals: number
): string {
  const minOutput = parseFloat(amountOut) * (1 - slippage / 100);
  return BigInt(Math.floor(minOutput * 10 ** toTokenDecimals)).toString();
}

export function calculateDeadline(): string {
  return (Math.floor(Date.now() / 1000) + 60 * 10).toString();
}

export function extractTokenData(arr: any[]) {
  return arr
    .map((item) => {
      return {
        tokenName: item.tokenName,
        tokenAddress: item.tokenId,
        tokenSymbol: item.tokenAbbr,
        tokenBalance: Number(item.balance),
        amountInUsd: item.amountInUsd,
      };
    })
    .filter((item) => {
      return item.tokenBalance > 0 && item.tokenName.toLowerCase() !== "trx";
    });
}
