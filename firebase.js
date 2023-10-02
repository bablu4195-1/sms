const admin = require('firebase-admin');
const messaging = admin.messaging();


// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


//send notification to the client
const sendNotification = (token, data) => {
    messaging.send(token, data).then((response) => {
        console.log('Successfully sent message:', response);
    })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}




//get the tokens from the database
const sendAClientNotificationToken = async () => {
    const query = `SELECT * FROM firebase_tokens`;
    const response = await sequelize.query(query);
    const token = await response[0][0].token;
    console.log(token);
    let data="hello my First notification"
    sendNotification(token, data);
    return token;
}

sendAClientNotificationToken();

//send the notification to the client

async function compareAndSend(){
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
            for(let i=0;i<result2.length;i++){
                sendnotification({token: result2[i].token,alert_price: result[0].alert_price});
            }
        }
    }
}

sendnotification = (data) => {
    const token = data.token;
    const payload = {
        notification: {
            title: 'Stock Alert',
            body: `The stock price has reached ${data.alert_price}`,
        }
    };
 messaging.send(token, payload)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

compareAndSend();




