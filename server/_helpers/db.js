const config = require('config.json');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.Account = require('../accounts/account.model')(mongoose);
db.RefreshToken = require('../refresh-tokens/refresh-token.model')(mongoose);
db.Device = require('../devices/device.model')(mongoose);
db.Log = require('../logs/log.model')(mongoose);
const { host, port, user, password, database } = config.database;
let url = `mongodb://${host}:${port}/${database}`;
db.mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(() => {
    console.log("Connected to the database!");
    }).catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});
module.exports = db;