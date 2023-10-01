const express = require('express');
const router = express.Router();
const database = require('../config/database');
const auth = require('../auth');
const kc = require('../stocks');
const ticker = require('../websocket');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
let stock_ticks = [];
async function getAllTokens() {
    try {
        let items = [];
        const query = `SELECT * FROM instrument_tokens`;
        const response = await sequelize.query(query);
        for(let i=0;i<response[0].length;i++){
            items.push(response[0][i].instrument_token);
        }
       //converting all the elements in the array to numbers
      items = items.map(Number);
      ticker.subscribe(items);
        ticker.setMode(ticker.modeFull, items);
    }
    catch(error) {
        console.log(error);
    }
}



ticker.connect();

ticker.on("connect", getAllTokens);
ticker.on("ticks", onTicks);

ticker.on("noreconnect", function () {
    console.log("noreconnect");
});

ticker.on("reconnecting", function (reconnect_interval, reconnections) {
    console.log(
        "Reconnecting: attempt - ",
        reconnections,
        " innterval - ",
        reconnect_interval
        );
    // if (reconnections >= 10) {
    //     ticker.disconnect();
    // }
    });

  function onTicks(ticks) {
    console.log("Ticks", ticks);
    stock_ticks = ticks;
  }

  console.log("Stock ticks",stock_ticks);
  
//   function subscribe() {
//     var items = [259849,249408004];
//     ticker.subscribe(items);
//     ticker.setMode(ticker.modeFull, items);
//   }


router.get('/nse', auth, async (req, res) => {
    try {
        kc.getInstruments("NSE").then(function (response) {
            // console.log(response);
            //send the response to the client
           res.status(200).send(response);
        }).catch(function (err) {
            console.log(err);
        });
      
    } catch(error ){
        res.status(500).send(error);
    }
});

router.get('/bse', auth, async (req, res) => {
    try {
        kc.getInstruments("BSE").then(function (response) {
            // console.log(response);
            //send the response to the client
           res.status(200).send(response);
        }).catch(function (err) {
            console.log(err);
        });
    } catch(error ){
        res.status(500).send(error);
    }
});

router.get('/selectedStocks/:id',auth,async(req,res)=>{
    try{
        const id = req.params.id;
        const query = `SELECT * FROM instrument_tokens WHERE user_id='${id}'`;
        const response = await sequelize.query(query);
        res.status(200).send(stock_ticks);
    } catch(error){
        console.log(error);
    }
})

router.post('/selectedItems',auth, async (req, res) => {
    try {
        const items = req.body.items;
        console.log(items);
        const id = req.body.user_id;
         for(let item of items){
             const query = `INSERT INTO instrument_tokens (instrument_token,user_id) VALUES ('${item}','${id}')`;
             sequelize.query(query);
         }
        res.status(200).send("Subscribed");

    } catch(error) {
        res.status(500).send(error);
    }
});



module.exports = router;