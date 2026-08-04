const mongoose = require('mongoose');
const dns = require('dns');

// Fix querySrv ECONNREFUSED issue on local networks/Windows by using public DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const MongoDB = process.env.MONGO_URI;

function connectDB(){
    mongoose.connect(`${MongoDB}`)
    .then(() => {
        console.log("MongoDB Connected Successfully 🎉");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error: ", err);
    });
}

module.exports = connectDB;