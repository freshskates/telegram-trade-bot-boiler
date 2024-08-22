const axios = require("axios");

const address = 'TAfL5Pw7y3RJXaUJdBjmzkGa7ZdNLmk56i'; //my test wallet hardcode

const options = {
  method: 'GET',
  url: `https://api.trongrid.io/v1/accounts/${address}`,
  headers: {accept: 'application/json'}
};

axios
  .request(options)
  .then(function (response) {
    console.log('response.data', response.data)
    //console.log('trc20 holdings', response.data.data[0].trc20)
  })
  .catch(function (error) {
    console.error(error);
  });
  