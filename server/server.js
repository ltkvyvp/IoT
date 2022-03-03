require('rootpath')();
const config = require('config.json');
const express = require('express');
const mqtt = require("mqtt");
const client = mqtt.connect(config.mqttServer);

const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const db = require('_helpers/db');
const Log = db.Log;
const Device = db.Device;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));
// api routes
app.use('/accounts', require('./accounts/accounts.controller'));
app.use('/devices', require('./devices/devices.controller'));
app.use('/logs', require('./logs/logs.controller'));
// swagger docs route
app.use('/api-docs', require('_helpers/swagger'));

// global error handler
app.use(errorHandler);

// start server
const hostname = 'localhost';
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, hostname, () => console.log('Server listening on port ' + port));

client.on("connect", ack => {
    console.log("connected!");
    // console.log(ack);
  
    client.subscribe("nodeWiFi32/data", err => {
      console.log(err);
    });
  
    // client.subscribe("nodeWiFi32/dht11/humidity", err => {
    //   console.log(err);
    // });
  
    // client.subscribe("nodeWiFi32/sm/do_am_dat", err => {
    //   console.log(err);
    // });
  
    // client.subscribe("test", err => {
    //   console.log(err);
    // });
  
    // client.subscribe("ESP32/temperature", err => {
    //   console.log(err);
    // });
  
    // client.subscribe("ESP32/humidity", err => {
    //   console.log(err);
    // });
    
    client.on("message", async (topic, message) => {
        message = JSON.parse(message);
        let data = [];
        for(let i in message) data.push({
            attributeName: i,
            value: message[i]
        });
        if (message['name']) {
            let device = await Device.findOne({ name: message['name'] });
            if (device) {
                let log = new Log({
                    device: device._id,
                    data: data
                })
                await log.save()
            }
        }
        console.log(data);

    });
});
  
client.on("error", err => {
  console.log(err);
});