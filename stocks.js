var KiteConnect = require("kiteconnect").KiteConnect;
const { request } = require("express");
const Sequelize = require('sequelize');
const { get } = require("./Routes/users");
const sequelize = new Sequelize(process.env.DATABASE_URL);

var kc = new KiteConnect({
  api_key: process.env.KITE_API_KEY,
    login_url: `https://kite.trade/connect/login?api_key=${process.env.KITE_API_KEY}&v=3`,
});

let access_token = ''


let generate = ()=> {
  kc.generateSession(process.env.KITE_REQUEST_TOKEN,process.env.KITE_API_SECRET).then(function (response) {
    //add the token to the database
    const query = `INSERT INTO access_tokens (access_token) VALUES ('${response.access_token}')`;
    sequelize.query(query);
        access_token = response.access_token;
        console.log(access_token);
      }
      ).catch(function (err) {
        console.log(err);
      });
      return access_token;
    }

    // generate();
    // async function getAccessToken() {
    //   // Get the access token from the database
    //   const query = `SELECT * FROM access_tokens`;
    //   const response = await sequelize.query(query);
      
    //   // The access token is stored in the response[0][0].access_token property
    //   // get the latest access token
    //   const accessToken = response[0][response[0].length - 1].access_token;
    //   return accessToken;
    // }

    // function init() {
      //   // Fetch equity margins.
      //   kc.getInstruments("NSE").then(function (response) {
        //     // console.log(response);
        //     //send the response to the client
        //      response = nseStocks
        //      return nseStocks;
        //   }).catch(function (err) {
          //     console.log(err);
          //   });
          
          //   kc.getInstruments("BSE").then(function (response) {
            //     // console.log(response);
            //     //send the response to the client
            //      response = bseStocks
            //      return bseStocks;
            //   }).catch(function (err) {
              //     console.log(err);
              //   });
              // }
// var ws = new WebSocket(`wss://ws.kite.trade?api_key=${process.env.KITE_API_KEY}&access_token=${access_token}}`);
// ws.on('message', function incoming(data) {
//   console.log(data);
// });


              
module.exports = kc;