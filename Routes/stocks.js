const express = require('express');
const router = express.Router();
const database = require('../config/database');
const auth = require('../auth');
const kc = require('../stocks');



router.get('/nse', auth, async (req, res) => {
    let nseStocks = []
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
        response = {
            "status": "success",
            "data": bseStocks
        }
        res.status(200).send(response);
    } catch(error ){
        res.status(500).send(error);
    }
});


module.exports = router;