const express = require("express");
const cors = require("cors");
const path = require("path");
const spawn = require("child_process").spawn;
const port = 8080;
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};

const pythonExePath = isDevelopment()
  ? path.join("C:", "conda", "envs", "movie_recommand", "python.exe")
  : path.join("/home/ubuntu/miniconda", "envs", "myenv", "bin", "python3");

// const pythonPath = path.join(
//   "C:",
//   "conda",
//   "envs",
//   "movie_recommand",
//   "python.exe"
// ); // 개발환경

// const pythonPath = path.join(
//   "/home/ubuntu/miniconda",
//   "envs",
//   "myenv",
//   "bin",
//   "python3"
// ); // 배포환경

app.get("/", (req, res) => {
  res.send("Hello from Node server!");
});

app.get("/random/:count", (req, res) => {
  const scriptPath = path.join(__dirname, "resolver.py");

  const count = req.params.count;
  const result = spawn(pythonExePath, [scriptPath, "random", count]);

  let responseData = "";

  //파이썬 파일 수행 결과를 받아온다
  result.stdout.on("data", function (data) {
    responseData += data.toString();
  });

  result.on("close", (code) => {
    if (code === 0) {
      const jsonResponse = JSON.parse(responseData);
      res.status(200).json(jsonResponse);
    } else {
      res.status(500).json({ error: `Child process exited with code ${code}` });
    }
  });

  result.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
});

app.get("/latest/:count", (req, res) => {
  const scriptPath = path.join(__dirname, "resolver.py");

  const count = req.params.count;
  const result = spawn(pythonExePath, [scriptPath, "latest", count]);

  let responseData = "";

  //파이썬 파일 수행 결과를 받아온다
  result.stdout.on("data", function (data) {
    responseData += data.toString();
  });

  result.on("close", (code) => {
    if (code === 0) {
      const jsonResponse = JSON.parse(responseData);
      res.status(200).json(jsonResponse);
    } else {
      res.status(500).json({ error: `Child process exited with code ${code}` });
    }
  });

  result.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
});

app.get("/genres/:genre/:count", (req, res) => {
  const scriptPath = path.join(__dirname, "resolver.py");

  const genre = req.params.genre;
  const count = req.params.count;
  const result = spawn(pythonExePath, [scriptPath, "genres", genre, count]);

  let responseData = "";

  //파이썬 파일 수행 결과를 받아온다
  result.stdout.on("data", function (data) {
    responseData += data.toString();
  });

  result.on("close", (code) => {
    if (code === 0) {
      const jsonResponse = JSON.parse(responseData);
      res.status(200).json(jsonResponse);
    } else {
      res.status(500).json({ error: `Child process exited with code ${code}` });
    }
  });

  result.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
});

app.get("/item-based/:item", (req, res) => {
  const scriptPath = path.join(__dirname, "recommender.py");

  const item = req.params.item;
  const result = spawn(pythonExePath, [scriptPath, "item-based", item]);

  let responseData = "";

  //파이썬 파일 수행 결과를 받아온다
  result.stdout.on("data", function (data) {
    responseData += data.toString();
  });

  result.on("close", (code) => {
    if (code === 0) {
      const jsonResponse = JSON.parse(responseData);
      res.status(200).json(jsonResponse);
    } else {
      res.status(500).json({ error: `Child process exited with code ${code}` });
    }
  });

  result.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
