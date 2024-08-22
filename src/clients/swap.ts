import TronWeb from 'tronweb';

export class SwapClient {
  private tronWeb: any;
  private smartRouterAddress: string;
  private routerApiUrl: string;

  constructor() {
    this.smartRouterAddress = 'TFVisXFaijZfeyeSjCEVkHfex7HGdTxzF9'; // SunSwap smart router CA
    this.routerApiUrl = 'https://rot.endjgfsv.link/swap/router'; // SunSwap Router API URL
  }

  private async estimateGasFee(transactionParams: any): Promise<number> {
    try {
      const { paths, poolVersions, versionLen, fees, data } = transactionParams;

      // Convert addresses to hex for the gas estimation
      const hexPaths = paths.map((address: string) => this.tronWeb.address.toHex(address));
      const hexData = [...data];
      hexData[2] = this.tronWeb.address.toHex(data[2]); // Convert the address in data[2] to hex

      const estimatedGas = await this.tronWeb.transactionBuilder.triggerConstantContract(
        this.smartRouterAddress,
        'swapExactInput(address[],string[],uint256[],uint24[],tuple(uint256,uint256,address,uint256))',
        {},
        [
          { type: 'address[]', value: paths },
          { type: 'string[]', value: poolVersions },
          { type: 'uint256[]', value: versionLen },
          { type: 'uint24[]', value: fees },
          { type: 'tuple(uint256,uint256,address,uint256)', value: hexData },
        ]
      );

      const energyUsed = estimatedGas.energy_used;
      const netUsed = estimatedGas.net_usage;
      const energyPrice = await this.tronWeb.trx.getEnergyFee();

      // Calculate estimated fee
      const fee = energyUsed * energyPrice + netUsed;

      console.log('Estimated Fee:', fee);
      return fee;
    } catch (error) {
      console.error('Error estimating gas fee:', error);
      throw error;
    }
  }
  private async getSwapRoute(fromToken: string, toToken: string, amountInSun: string): Promise<any> {
    try {

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

  

  private async approveToken(tokenAddress: string, amount: string) {
    try {
      const ERC20_ABI = [
        {
          "constant": false,
          "inputs": [
            {
              "name": "spender",
              "type": "address"
            },
            {
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "type": "function"
        }
      ];
      
      const contract = await this.tronWeb.contract(ERC20_ABI, tokenAddress);
      const result = await contract.methods.approve(this.smartRouterAddress, amount).send();
      console.log('Token approved:', result);
      return result;
    } catch (error) {
      console.error('Error during token approval:', error);
      throw error;
    }
  }
  

  async swap(privateKey: string, fromToken: string, toToken: string, amountIn: string, slippage: number): Promise<any> {

    try {
      this.tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
        privateKey: privateKey,
      });

     const abi = [
        {
            "inputs": [
                {"internalType":"address","name":"_v2Router","type":"address"},
                {"internalType":"address","name":"_v1Foctroy","type":"address"},
                {"internalType":"address","name":"_psmUsdd","type":"address"},
                {"internalType":"address","name":"_v3Router","type":"address"},
                {"internalType":"address","name":"_wtrx","type":"address"}
            ],
            "stateMutability":"nonpayable",
            "type":"constructor"
        },
        {
            "anonymous":false,
            "inputs":[
                {"indexed":true,"internalType":"address","name":"owner","type":"address"},
                {"indexed":true,"internalType":"address","name":"pool","type":"address"},
                {"indexed":false,"internalType":"address[]","name":"tokens","type":"address[]"}
            ],
            "name":"AddPool",
            "type":"event"
        },
        {
            "anonymous":false,
            "inputs":[
                {"indexed":true,"internalType":"address","name":"admin","type":"address"},
                {"indexed":true,"internalType":"address","name":"pool","type":"address"},
                {"indexed":false,"internalType":"address[]","name":"tokens","type":"address[]"}
            ],
            "name":"ChangePool",
            "type":"event"
        },
        {
            "anonymous":false,
            "inputs":[
                {"indexed":true,"internalType":"address","name":"buyer","type":"address"},
                {"indexed":true,"internalType":"uint256","name":"amountIn","type":"uint256"},
                {"indexed":false,"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}
            ],
            "name":"SwapExactETHForTokens",
            "type":"event"
        },
        {
            "anonymous":false,
            "inputs":[
                {"indexed":true,"internalType":"address","name":"buyer","type":"address"},
                {"indexed":true,"internalType":"uint256","name":"amountIn","type":"uint256"},
                {"indexed":false,"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}
            ],
            "name":"SwapExactTokensForTokens",
            "type":"event"
        },
        {
            "anonymous":false,
            "inputs":[
                {"indexed":true,"internalType":"address","name":"originOwner","type":"address"},
                {"indexed":true,"internalType":"address","name":"newOwner","type":"address"}
            ],
            "name":"TransferAdminship",
            "type":"event"
        },
        {
            "anonymous":false,
            "inputs":[
                {"indexed":true,"internalType":"address","name":"originOwner","type":"address"},
                {"indexed":true,"internalType":"address","name":"newOwner","type":"address"}
            ],
            "name":"TransferOwnership",
            "type":"event"
        },
        {
            "stateMutability":"payable",
            "type":"fallback"
        },
        {
            "inputs":[],
            "name":"WTRX",
            "outputs":[
                {"internalType":"address","name":"","type":"address"}
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"string","name":"poolVersion","type":"string"},
                {"internalType":"address","name":"pool","type":"address"},
                {"internalType":"address[]","name":"tokens","type":"address[]"}
            ],
            "name":"addPool",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"string","name":"poolVersion","type":"string"},
                {"internalType":"address","name":"pool","type":"address"},
                {"internalType":"address","name":"gemJoin","type":"address"},
                {"internalType":"address[]","name":"tokens","type":"address[]"}
            ],
            "name":"addPsmPool",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"string","name":"poolVersion","type":"string"},
                {"internalType":"address","name":"pool","type":"address"},
                {"internalType":"address[]","name":"tokens","type":"address[]"}
            ],
            "name":"addUsdcPool",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        },
        {
            "inputs":[],
            "name":"admin",
            "outputs":[
                {"internalType":"address","name":"","type":"address"}
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"address","name":"pool","type":"address"},
                {"internalType":"address[]","name":"tokens","type":"address[]"}
            ],
            "name":"changePool",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"string","name":"poolVersion","type":"string"}
            ],
            "name":"isPsmPool",
            "outputs":[
                {"internalType":"bool","name":"","type":"bool"}
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"string","name":"poolVersion","type":"string"}
            ],
            "name":"isUsdcPool",
            "outputs":[
                {"internalType":"bool","name":"","type":"bool"}
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "inputs":[],
            "name":"owner",
            "outputs":[
                {"internalType":"address","name":"","type":"address"}
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "inputs":[],
            "name":"psmUsdd",
            "outputs":[
                {"internalType":"address","name":"","type":"address"}
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"address","name":"token","type":"address"},
                {"internalType":"address","name":"to","type":"address"},
                {"internalType":"uint256","name":"amount","type":"uint256"}
            ],
            "name":"retrieve",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"address[]","name":"path","type":"address[]"},
                {"internalType":"string[]","name":"poolVersion","type":"string[]"},
                {"internalType":"uint256[]","name":"versionLen","type":"uint256[]"},
                {"internalType":"uint24[]","name":"fees","type":"uint24[]"},
                {
                    "components":[
                        {"internalType":"uint256","name":"amountIn","type":"uint256"},
                        {"internalType":"uint256","name":"amountOutMin","type":"uint256"},
                        {"internalType":"address","name":"to","type":"address"},
                        {"internalType":"uint256","name":"deadline","type":"uint256"}
                    ],
                    "internalType":"struct SmartExchangeRouter.SwapData",
                    "name":"data",
                    "type":"tuple"
                }
            ],
            "name":"swapExactInput",
            "outputs":[
                {"internalType":"uint256[]","name":"amountsOut","type":"uint256[]"}
            ],
            "stateMutability":"payable",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"address","name":"newAdmin","type":"address"}
            ],
            "name":"transferAdminship",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"address","name":"newOwner","type":"address"}
            ],
            "name":"transferOwnership",
            "outputs":[],
            "stateMutability":"nonpayable",
            "type":"function"
        },
        {
            "inputs":[
                {"internalType":"uint256","name":"amountMinimum","type":"uint256"},
                {"internalType":"address","name":"recipient","type":"address"}
            ],
            "name":"unwrapWTRX",
            "outputs":[],
            "stateMutability":"payable",
            "type":"function"
        },
        {
            "inputs":[],
            "name":"v1Factory",
            "outputs":[
                {"internalType":"address","name":"","type":"address"}
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "inputs":[],
            "name":"v2Router",
            "outputs":[
                {"internalType":"address","name":"","type":"address"}
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "inputs":[],
            "name":"v3Router",
            "outputs":[
                {"internalType":"address","name":"","type":"address"}
            ],
            "stateMutability":"view",
            "type":"function"
        },
        {
            "stateMutability":"payable",
            "type":"receive"
        }
    ];


      const WTRX = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb';

      if (fromToken === 'TRX') {
        fromToken = WTRX;
      }
      if (toToken === 'TRX') {
        toToken = WTRX;
      }

      console.log('Initialized TronWeb with address:', this.tronWeb.defaultAddress.base58);
      // Convert the amount based on the token decimals
      let amountInSun: string;
      if (fromToken === WTRX) {
        amountInSun = this.tronWeb.toSun(amountIn).toString(); // TRX is 6 decimals
      } else {
        amountInSun = (BigInt(parseFloat(amountIn)) * BigInt(1e18)).toString(); // Assuming 18 decimals for other tokens
      }

      const routeInfo = await this.getSwapRoute(fromToken, toToken, amountInSun);
      console.log('Route Info:', routeInfo);

      const paths = routeInfo.tokens;
     
      const fees = routeInfo.poolFees;

      const poolVersions = [];
      const versionLen = [];
      
      let currentVersion = routeInfo.poolVersions[0];
      let currentLength = 1;  // Start with 1 since the first token is always part of the first pool
      
      // Loop through the tokens, starting from the second token
      for (let i = 1; i < routeInfo.tokens.length; i++) {
        const previousToken = routeInfo.tokens[i - 1];
        const currentToken = routeInfo.tokens[i];
      
        // If the pool version for this swap is the same as the current version, increment the length
        if (routeInfo.poolVersions[i - 1] === currentVersion) {
          currentLength++;
        } else {
          // If the pool version changes, push the current version and its length, then reset
          poolVersions.push(currentVersion);
          versionLen.push(currentLength);
          
          currentVersion = routeInfo.poolVersions[i - 1];
          currentLength = 1;  // Reset length for the new pool version
        }
      }
      
      // Push the final segment
      poolVersions.push(currentVersion);
      versionLen.push(currentLength);
      
      console.log('Final Pool Versions:', poolVersions);
      console.log('Final Version Lengths:', versionLen);
      
      console.log('Final Pool Versions:', poolVersions);
      console.log('Final Version Lengths:', versionLen);


      let amountOutSun: string;
      if (toToken === WTRX) {
        amountOutSun = this.tronWeb.toSun(routeInfo.amountOut).toString(10); // TRX (WTRX) uses 6 decimals
      } else {
        amountOutSun = (parseFloat(routeInfo.amountOut) * 1e18).toString(10); // Assuming 18 decimals for other tokens
      }

      // Calculate amountOutMinimumSun using the expected output amount with slippage tolerance
      const amountOutMinimumSun = Math.floor(parseFloat(amountOutSun) * (1 - slippage / 100)).toString(10);

      const deadline = (Math.floor(Date.now() / 1000) + 60 * 10).toString(10); // 10-minute deadline

      const data = [
        amountInSun,
        amountOutMinimumSun,
        this.tronWeb.defaultAddress.base58,
        deadline,
      ];

      const transactionParams = {
        paths,
        poolVersions,
        versionLen,
        fees,
        data,
      };

      if (fromToken !== WTRX) {
        await this.approveToken(fromToken, amountInSun);
      }



      console.log('Paths:', paths);
      console.log('Pool Versions:', poolVersions);
      console.log('Version Lengths:', versionLen);
      console.log('Fees:', fees);
      console.log('Swap Data:', data);

      const router = await this.tronWeb.contract(
        abi, // ABI hard coded 
        this.smartRouterAddress,
      );

      console.log('Successfully initialized Smart Router contract at:', this.smartRouterAddress);

      const transaction = await router.swapExactInput(
        paths,
        poolVersions,
        versionLen,
        fees,
        data
      ).send({
        callValue: fromToken === WTRX ? amountInSun : 0,
        feeLimit: 100 * 1e6,
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
