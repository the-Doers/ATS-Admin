const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
let mysql = require("mysql");
const { result } = require("lodash");

const app = express();

// let connection = mysql.createConnection({
//     host: 'remotemysql.com',
//     user: 'BUIYPTQ3nb',
//     password: 'QeJzztQw2D',
//     database: 'BUIYPTQ3nb'
// });

// connection.connect(function (err) {
//     if (err) {
//         return console.error('error: ' + err.message);
//     }
//     console.log('Connected to the MySQL server.');
// });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const name = req.body.userName;
  const pw = req.body.pw;
  if (name === "admin" && pw === "root") {
    res.render("home", { status: "ok" });
  }
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/token", (req, res) => {
  res.render("token");
});

app.get("/delete", (req, res) => {
  res.render("delete");
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.get("/view", (req, res) => {
  res.render("view");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000");
});
