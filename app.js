const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
let mysql = require("mysql");
const { result } = require("lodash");

const app = express();

let connection = mysql.createConnection({
  host: "remotemysql.com",
  user: "jsdmPgLJ0k",
  password: "t0XUXdJsm9",
  database: "jsdmPgLJ0k",
});

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the MySQL server.");
});

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

//_______________________________ADD PASSENGER_______________________________//
app.get("/addPassenger", (req, res) => {
  res.render("addPassenger");
});

app.post("/addPassenger", (req, res) => {
  res.render("addPassenger");
});

//_______________________________ISSUE TICKET_______________________________//
app.get("/issueTicket", (req, res) => {
  connection.query("select * from Stations", (error, result, fields) => {
    if (error) throw error;
    res.render("./issueTicket", { data: result });
  });
});

app.post("/issueTicket", (req, res) => {
  const startStation = req.body.ss;
  const endStation = req.body.es;
  const fare = Math.abs(startStation - endStation) * 10;
  const dateAndTime = new Date();
  console.log(dateAndTime);
  connection.query(
    "insert into TravelRecord (PID, StartID, EndID, StartTime, EndTime, Fare) values (?)",
    [[1, startStation, endStation, dateAndTime, dateAndTime, fare]],
    (error, result) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log(result.insertId);
        res.render("./ticketDetails", {
          ticketID: result.insertId,
          fare: fare,
        });
      }
    }
  );
});

//_______________________________VIEW ISSUED TICKETS____________________________________//

//_______________________________DELETE PASSENGER_______________________________//
app.get("/deletePassenger", (req, res) => {
  connection.query(
    "select * from PassengerDetails",
    (error, result, fields) => {
      if (error) throw error;
      res.render("deletePassenger", { data: result });
    }
  );
});

app.post("/deletePassenger", (req, res) => {
  const pid = req.body.PID;
  connection.query(
    "DELETE FROM PassengerDetails WHERE PID=" + connection.escape(pid),
    (error, result, fields) => {
      if (error) throw error;
      else {
        var message =
          "Deleted details of Passenger ID " + connection.escape(pid);
        console.log(result)
        res.render("./success", { message: message });
      }
    }
  );
});

app.get("/update", (req, res) => {
  res.render("update");
});

//_______________________________VIEW PASSENGER DETAILS_______________________________//
app.get("/viewPassengerDetails", (req, res) => {
  connection.query(
    "select * from PassengerDetails",
    (error, result, fields) => {
      if (error) throw error;
      res.render("./viewPassengerDetails", { data: result });
    }
  );
});

app.post("/viewPassengerDetails", (req, res) => {
  const pid = req.body.pid;
  connection.query(
    "SELECT * FROM PassengerDetails WHERE PID=" + connection.escape(pid),
    (error, result, fields) => {
      if (error) throw error;
      connection.query("SELECT * FROM TravelRecord WHERE PID=" + connection.escape(pid), (error1, result1, fields1) => {
        if (error1) throw error1;
        console.log(result)
        res.render("passengerDetails", { data: result, data1: result1 });
      });
    }
  );
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000");
});
