const axios = require("axios");

const address = 'TAfL5Pw7y3RJXaUJdBjmzkGa7ZdNLmk56i'; //my test wallet hardcode

const options = {
  method: 'GET',
  url: `https://api.trongrid.io/v1/accounts/${address}/transactions`,
  headers: {accept: 'application/json'}
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });