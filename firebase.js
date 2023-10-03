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
const ticker = require('./websocket');
let stock_ticks = [];
// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function sendingNotification(data) {

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
        console.log('Push notification sent successfully!',response);
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
        return token;
    }).catch((error) => {
        console.log(error);
        });
}

ticker.connect();
ticker.on("connect", sendANotification);
ticker.on("ticks", onTicks);
function onTicks(ticks) {
  // console.log("Ticks", ticks);
  stock_ticks = ticks;
}
// Route to send a notification to the client
router.post('/notification', async (req, res) => {
    // Get the token from the request body
    const token =  req.body.token;
      let data = {
        title: 'SMS',
        alert_price: 'Welcome to the Stock Message System',
      }
    // Send the notification
    sendingNotification(data);
  
    // Send a response to the client
    res.status(200).send('Notification sent');
  });

const compareAndSend = async () => {
    for(let i=0;i<stock_ticks.length;i++){
        const query = `SELECT * FROM instrument_tokens WHERE instrument_token='${stock_ticks[i].instrument_token}'`;
        const response = await sequelize.query(query);
        const result = response[0];
        if(stock_ticks[i].last_price <= result[0].alert_price){
            // if(stock_ticks[i].last_price <= 100){
            //send notification
            const query2 = `SELECT * FROM firebase_tokens`;
            const response2 = await sequelize.query(query2);
            const result2 = response2[0];
            console.log(result2);
            for(let i=0;i<stock_ticks.length;i++){
                let data = {
                    title: result,
                    alert_price: stock_ticks[i]
                }
                sendingNotification(data);
            }
        }
    }
}
compareAndSend();
module.exports = router;
