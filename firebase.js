// const admin = require('firebase-admin');
// const messaging = admin.messaging();


// // Initialize the Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


// //send notification to the client
// const sendNotification = (token, data) => {
//     messaging.send(token, data).then((response) => {
//         console.log('Successfully sent message:', response);
//     })
//         .catch((error) => {
//             console.log('Error sending message:', error);
//         });
// }




// //get the tokens from the database
// const sendAClientNotificationToken = async () => {
//     const query = `SELECT * FROM firebase_tokens`;
//     const response = await sequelize.query(query);
//     const token = await response[0][0].token;
//     console.log(token);
//     let data="hello my First notification"
//     sendNotification(token, data);
//     return token;
// }

// sendAClientNotificationToken();

// //send the notification to the client

// async function compareAndSend(){
//     for(let i=0;i<stock_ticks.length;i++){
//         const query = `SELECT * FROM instrument_tokens WHERE instrument_token='${stock_ticks[i].instrument_token}'`;
//         const response = await sequelize.query(query);
//         const result = response[0];
//         if(stock_ticks[i].last_price <= result[0].alert_price){
//             // if(stock_ticks[i].last_price <= 100){
//             //send notification
//             const query2 = `SELECT * FROM firebase_tokens`;
//             const response2 = await sequelize.query(query2);
//             const result2 = response2[0];
//             for(let i=0;i<result2.length;i++){
//                 sendnotification({token: result2[i].token,alert_price: result[0].alert_price});
//             }
//         }
//     }
// }

// sendnotification = (data) => {
//     const token = data.token;
//     const payload = {
//         notification: {
//             title: 'Stock Alert',
//             body: `The stock price has reached ${data.alert_price}`,
//         }
//     };
//  messaging.send(token, payload)
//         .then((response) => {
//             console.log('Successfully sent message:', response);
//         })
//         .catch((error) => {
//             console.log('Error sending message:', error);
//         });
// }

// compareAndSend();
const admin = require('firebase-admin');
const serviceAccount = require('./stockmessagesystem-firebase-adminsdk-9lf13-968e61f7a8.json');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);
const express = require('express');
const router = express.Router();

// Initialize the Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

function sendingNotification(datatoken) {

    // Create a new message object
    const message = {
        notification: {
            title: 'Thank you for chosing us',
            body: 'Welcome to Stock Messaging System',
        },
        // The registration token of the device to send the notification to
        token: datatoken,
    };

    // Send the push notification
    admin.messaging().send(message)
        .then((response) => {
            console.log('Push notification sent successfully!', response);
        })
        .catch((error) => {
            console.log('Error sending push notification:', error);
        });
}

function sendingNotifications(data, datatoken) {

    // Create a new message object
    const message = {
        notification: {
            title: data.title,
            body: data.alert_price,
        },
        // The registration token of the device to send the notification to
        token: datatoken,
    };

    // Send the push notification
    admin.messaging().send(message)
        .then((response) => {
            console.log('Push notification sent successfully!', response);
        })
        .catch((error) => {
            console.log('Error sending push notification:', error);
        });
}
// //get the tokens from the database
const sendANotification = async () => {
    //get the token from the database
    const query = `SELECT * FROM firebase_tokens`;
    sequelize.query(query).then((response) => {
        const token = response[0][0].token;
        sendingNotification(token);
        return token;
    }).catch((error) => {
        console.log(error);
    });
}


// Route to send a notification to the client
router.post('/notification', async (req, res) => {
    // Get the token from the request body
    const token = req.body.token;

    // Send the notification
    await sendANotification();
    sendingNotification(token);

    // Send a response to the client
    res.status(200).send('Notification sent');
});

const ticker = require('./websocket')
let stock_ticks = [];
ticker.connect();
ticker.on("connect", getAllTokens);
ticker.on("ticks", onTicks);
async function compareAndSend(stock_ticks) {
    let items = [];
    let getItems = []
    items = stock_ticks;
    // console.log("items", items);
    //get instrument tokens from the items
    items.map((items)=>{
        if(!isNaN(items.instrument_token)){
            getItems.push(items.instrument_token);
        }
    })
    console.log("getItems", getItems);
    for (let i = 0; i < getItems.length; i++) {
      if(!isNaN(getItems[i])) {
      const query = `SELECT * FROM instrument_tokens WHERE instrument_token='${getItems[i]}'`;
      const response = await sequelize.query(query);
      const result = response[0];
      
      // Send notification
      if (result !== undefined && result[0].alert_price !== null) {

        if (items[i].last_price <= result[0].alert_price) {
          const query2 = `SELECT * FROM firebase_tokens`;
          const response2 = await sequelize.query(query2);
          const result2 = response2[0];
          console.log(result2);
          for (let i = 0; i < result2.length; i++) {
            const data = {
              title: 'Stock Alert',
              alert_price: result[0].alert_price,
            };
            console.log("alert");
            sendingNotifications(data, result2[i].token);
          }
        }
      }
    }
  }
}
  
  
async function getAllTokens() {
    try {
        let items = [];
        const query = `SELECT * FROM instrument_tokens`;
        const response = await sequelize.query(query);
        for (let i = 0; i < response[0].length; i++) {
            items.push(response[0][i].instrument_token);
        }
        //converting all the elements in the array to numbers
        items = items.map(Number);
        ticker.subscribe(items);
        onTicks(items);
        ticker.setMode(ticker.modeFull, items);
    }
    catch (error) {
        console.log(error);
    }
}



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
    // console.log("Ticks", ticks);
    stock_ticks = ticks;
    // console.log("Stock ticks", stock_ticks);
    // console.log(stock_ticks);
    compareAndSend(stock_ticks);
}


module.exports = router;
