const app = require("./app");
// const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Handle uncaught exceptions.This should be placed at top not at bottom.
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting Down due to uncaught exception`);
  process.exit(1);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  // in case of production we will provide this file from heroku settings else we should send from code.
  require("dotenv").dotenv.config({ path: "BACK_END/config/config.env" });
}

//connecting to Database
connectDatabase();

// setting up coludinary configuration

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server Started on PORT :${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// Handle unhandle promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR:${err.message}`);
  console.log("shutting down the server due to unhandled prmose rejection");
  server.close(() => {
    process.exit(1);
  });
});
