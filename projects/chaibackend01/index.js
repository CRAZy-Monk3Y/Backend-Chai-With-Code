const express = require("express");
require('dotenv').config()

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/health", (req, res) => {
  res.json({ message: "Server is Running..." });
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
