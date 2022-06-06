const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload"); // this is for uploading the file
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const path = require("path");

const errorMiddleware = require("./MiddleWares/errors");

if (process.env.NODE_ENV !== "PRODUCTION") {
  // in case of production we will provide this file from heroku settings else we should send from code.
  require("dotenv").dotenv.config({ path: "BACK_END/config/config.env" });
}
// dotenv.config({ path: "BACK_END/config/config.env" });

//import all routes
const products = require("./Routes/productRouter");
const auth = require("./Routes/authRouter");
const order = require("./Routes/orderRoute");
const payment = require("./Routes/paymentRouter");

// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser()); // we should keep it at this location only as the routes product & auth might have authorized code so to get it work we should place it here only.
// app.use(fileUpload());
app.use(fileUpload());
//her we should pass cloudname apikey  then apisecret

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// before to deployment we should add this code.
if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  // here what we are doing is simply bypassing all the routes we get to production compact build file.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

//MiddleWare to handle Error
//when ever error happend flow comes to this point from next function.
//in next function of controller we are explicitly calling the middle ware.
//where to go we are defining in errorMiddleWare. how to formate the error we are defining in D:\MERN-STACK-E_COMMERCE\BUY-IT\BACK_END\Utils\ErrorHandler.js file.
// so by taking the object by formating the error object and sending it to middle ware.
app.use(errorMiddleware);

module.exports = app;

// we should import cookie parser before testing the product rout being authorized. this is done by importing cookie parser.
