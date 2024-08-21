import TronWeb from 'tronweb';

export class SwapClient {
  private tronWeb: any;
  private routerAddress: string;
  private routerApiUrl: string;

  constructor() {
    this.routerAddress = 'TQAvWQpT9H916GckwWDJNhYZvQMkuRL7PN'; // SunSwap v3 Router Address this version attempts to use only the v3 router, transactions reverted when trying, unsure why
    this.routerApiUrl = 'https://rot.endjgfsv.link/swap/router'; // SunSwap Router API URL
  }

  private async getSwapRoute(fromToken: string, toToken: string, amountIn: string): Promise<any> {
    try {
      const amountInSun = this.tronWeb.toSun(amountIn);
      const apiUrl = `${this.routerApiUrl}?fromToken=${fromToken}&toToken=${toToken}&amountIn=${amountInSun}&typeList=PSM,CURVE,CURVE_COMBINATION,WTRX,SUNSWAP_V1,SUNSWAP_V2,SUNSWAP_V3`;
      console.log('API Request URL:', apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.code !== 0) {
        throw new Error(`Error fetching swap route: ${data.message}`);
      }

      if (!data.data || data.data.length === 0) {
        throw new Error('No valid swap route found.');
      }

      return data.data[0];
    } catch (error) {
      console.error('Error getting swap route:', error);
      throw error;
    }
  }

  async swap(privateKey: string, fromToken: string, toToken: string, amountIn: string, recipient: string): Promise<any> {
    try {
      const WTRX = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';

      if (fromToken === 'TRX') {
          fromToken = WTRX;
      }
      if (toToken === 'TRX') {
          toToken = WTRX;
      }

      this.tronWeb = new TronWeb({
          fullHost: 'https://api.trongrid.io',
          privateKey: privateKey,
      });

      console.log('Initialized TronWeb with address:', this.tronWeb.defaultAddress.base58);

      const routeInfo = await this.getSwapRoute(fromToken, toToken, amountIn);
      console.log('Route Info:', routeInfo);

      const paths = routeInfo.tokens;
      console.log('Swap Path:', paths);

      const poolVersions = routeInfo.poolVersions;
      console.log('Pool Versions:', poolVersions);

      const amountInSun = Math.floor(this.tronWeb.toSun(amountIn));
      const amountOutMinimumSun = Math.floor(this.tronWeb.toSun(routeInfo.amountOut));
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10-minute deadline
      const totalFee = routeInfo.poolFees.reduce((acc: any, fee: any) => acc + parseFloat(fee), 0);
      console.log("fee:", totalFee)
      let method = "exactInputSingle";

      // If the path includes more than one token, use exactInput
      if (paths.length > 2) {
        method = "exactInput";
      }

      const swapParams = {
        tokenIn: fromToken,
        tokenOut: toToken,
        fee: totalFee, // Unsure if this is correct, all fees added together  
        recipient: recipient,
        deadline: deadline.toString(),
        amountIn: amountInSun.toString(),
        amountOutMinimum: amountOutMinimumSun.toString(),
        sqrtPriceLimitX96: 0, // Default to no price limit setting this to 0 makes it so there is no limits
      };

      console.log('Swap Params:', swapParams);

      const router = await this.tronWeb.contract().at(this.routerAddress);
      console.log('Successfully initialized contract at:', this.routerAddress);

      const transaction = await router[method](swapParams).send({
          feeLimit: 15000000000, //maxed out
          shouldPollResponse: true,
      });

      console.log('Transaction:', transaction);
      return transaction;
    } catch (error) {
      console.error('Error performing swap:', error);
      throw error;
    }
  }
}
