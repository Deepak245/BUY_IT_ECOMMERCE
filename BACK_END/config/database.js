const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config({path:"BACK_END/config/config.env"});
// console.log(process.env.DB_DEV_URI);
const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_DEV_URI).then(result=>{
        console.log("MongoDB Connected")
    });


}


module.exports= connectDatabase;