var KiteTicker = require("kiteconnect").KiteTicker;
const WebSocket = require('ws');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

var ticker = new KiteTicker({
    api_key: process.env.KITE_API_KEY,
    access_token: process.env.ACCESS_TOKEN,
});

//set autoreconnect with 10 maximum reconnections and 5 second interval
// ticker.connect();

// ticker.on("connect", subscribe);
// ticker.on("ticks", onTicks);

// ticker.on("noreconnect", function () {
//     console.log("noreconnect");
// });

// ticker.on("reconnecting", function (reconnect_interval, reconnections) {
//     console.log(
//         "Reconnecting: attempt - ",
//         reconnections,
//         " innterval - ",
//         reconnect_interval
//         );
//     // if (reconnections >= 10) {
//     //     ticker.disconnect();
//     // }
//     });

//   function onTicks(ticks) {
//     console.log("Ticks", ticks);
//   }
  
//   function subscribe() {
//     var items = [259849,249408004];
//     ticker.subscribe(items);
//     ticker.setMode(ticker.modeFull, items);
//   }

module.exports = ticker;