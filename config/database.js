const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(console.log("Db is successfully Connected"))
    .catch((error) => {
        console.log("Error while connection");
        console.log(error)
        process.exit(1);
    });
};