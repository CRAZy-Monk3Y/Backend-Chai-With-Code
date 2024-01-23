import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// bad Practice
app.use(express.static('dist'))

const port = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// get a list of 5 jokes
app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      id: 1,
      title: "This is joke 1",
      content: "This is body of joke 1",
    },
    {
      id: 2,
      title: "This is joke 2",
      content: "This is body of joke 2",
    },
    {
      id: 3,
      title: "This is joke 3",
      content: "This is body of joke 3",
    },
    {
      id: 4,
      title: "This is joke 4",
      content: "This is body of joke 4",
    },
    {
      id: 5,
      title: "This is joke 5",
      content: "This is body of joke 5",
    },
  ];
  res.status(200).json({ jokes });
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
