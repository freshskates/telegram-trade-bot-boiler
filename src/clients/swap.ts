import TronWeb from 'tronweb';

export class SwapClient {
  private tronWeb: any;
  private smartRouterAddress: string;
  private routerApiUrl: string;

  constructor() {
    this.smartRouterAddress = 'TFVisXFaijZfeyeSjCEVkHfex7HGdTxzF9'; // SunSwap v2 Router Address
    this.routerApiUrl = 'https://rot.endjgfsv.link/swap/router'; // SunSwap Router API URL
  }

  private async getSwapRoute(fromToken: string, toToken: string, amountIn: string): Promise<any> {
    try {
      
      const amountInSun = this.tronWeb.toSun(amountIn);
      const apiUrl = `${this.routerApiUrl}?fromToken=${fromToken}&toToken=${toToken}&amountIn=${amountInSun}&typeList=PSM,CURVE,CURVE_COMBINATION,WTRX,SUNSWAP_V2`;
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

  async swap(privateKey: string, fromToken: string, toToken: string, amountIn: string, slippage: number): Promise<any> {
    try {
      this.tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        privateKey: privateKey,
      });

      const WTRX = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';

      if (fromToken === 'TRX') {
        fromToken = WTRX;
      }
      if (toToken === 'TRX') {
        toToken = WTRX;
      }

      console.log('Initialized TronWeb with address:', this.tronWeb.defaultAddress.base58);

      const routeInfo = await this.getSwapRoute(fromToken, toToken, amountIn);
      console.log('Route Info:', routeInfo);

      const paths = routeInfo.tokens;
      const poolVersions = routeInfo.poolVersions;
      const fees = routeInfo.poolFees;
      const versionLen = [paths.length]; // The length of each pool path

      const amountInSun = Math.floor(this.tronWeb.toSun(amountIn));
      const amountOutMinimumSun = Math.floor(this.tronWeb.toSun(routeInfo.amountOut) * (1 - slippage / 100));
      const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10-minute deadline

      const swapData = {
        amountIn: amountInSun.toString(),
        amountOutMin: amountOutMinimumSun.toString(),
        to: this.tronWeb.defaultAddress.base58,
        deadline: deadline.toString(),
      };

      console.log('Paths:', paths);
      console.log('Pool Versions:', poolVersions);
      console.log('Version Lengths:', versionLen);
      console.log('Fees:', fees);
      console.log('Swap Data:', swapData);

      const router = await this.tronWeb.contract().at(this.smartRouterAddress);
      console.log('Successfully initialized Smart Router contract at:', this.smartRouterAddress);

      const transaction = await router.swapExactInput(
        paths,
        poolVersions,
        versionLen,
        fees,
        swapData
      ).send({
        feeLimit: 15000000,
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