// require("dotenv").config();
// import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

// import express from "express";

// dotenv.config({
//   path: "./env",
// });

// const app = express();
// function connectDB() {}

// connectDB()
/*
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI} /$
        {DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERROR", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR", error);
    throw err;
  }
})();
*/

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    console.log(
      `/n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MONGO DB CONNECTION ERROR");
    process.exit(1);
  }
};

export default connectDB;
