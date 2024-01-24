import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`Server Started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("Db Connection Failed ", err));

/*
const app = express();
// using iffy
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.error("ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is listening on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();
*/
