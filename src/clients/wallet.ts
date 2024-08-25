import axios from "axios";

interface TokenPosition {
  tokenName: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenBalance: number;
  value: number;
}

export class WalletClient {
  static async getWalletInfo() {
    const address = "TEQRwRYWrGEVktiSPrqDNkdW4P4Ye1FhDk"; //random whale wallet

    const options = {
      method: "GET",
      url: `https://api.trongrid.io/v1/accounts/${address}`,
      headers: { accept: "application/json" },
    };

    function formatTokens(arr: any) {
      return arr.map((obj: any) => {
        let updatedObj: Record<any, any> = {};
        for (let key in obj) {
          let value = Number(obj[key]) / 1e18;
          updatedObj[key] = value;
        }
        return updatedObj;
      });
    }

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        console.log(formatTokens(response.data.data[0].trc20));
        console.log("assetV2", response.data.data[0].assetV2);
        //console.log(response.data.data[0].trc20)
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}
