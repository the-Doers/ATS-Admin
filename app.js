const express = require("express");
const bodyParser = require("body-parser");
let mysql = require("mysql");
const multer = require("multer");
const app = express();
var upload = multer({ dest: "uploads/" });

var cpUpload = upload.fields([{ name: "avatar", maxCount: 8 }]);
var loggedIn = false;

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
    res.render("home");
    loggedIn = true;
  }
});

app.get("/logout", (req, res) => {
  isLoggedIn = false;
  res.redirect("/");
});

app.get("/home", (req, res) => {
  if (loggedIn) {
    res.render("home");
  } else {
    res.redirect("/");
  }
});
app.post("/home", (req, res) => {
  console.log(loggedIn);
  res.render("home");
});

//__________ADD PASSENGER__________//
app.get("/addPassenger", (req, res) => {
  if (loggedIn) {
    res.render("addPassenger");
  } else {
    res.redirect("/");
  }
});

app.post("/addPassenger", cpUpload, (req, res) => {
  const PFName = req.body.fname;
  const PLName = req.body.lname;
  const PhoneNo = req.body.number;
  const EmailID = req.body.email;
  let file = "";
  req.files["avatar"].forEach((ele) => {
    var name = ele.filename.toString();
    file = file.concat(name);
  });
  console.log(file);
  connection.query(
    "INSERT INTO PassengerDetails (PFName,PLName,PhoneNo,EmailID,FileID) VALUES (?)",
    [[PFName, PLName, PhoneNo, EmailID, file]],
    (error, result) => {
      if (error) throw error;
      else {
        res.render("success", {
          message: "Added Passenger into Database succesfully",
        });
      }
    }
  );
});

//__________ISSUE TICKET__________//
app.get("/issueTicket", (req, res) => {
  if (loggedIn) {
    connection.query("select * from Stations", (error, result, fields) => {
      if (error) throw error;
      res.render("./issueTicket", { data: result });
    });
  } else {
    res.redirect("/");
  }
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

//__________DELETE PASSENGER__________//
app.get("/deletePassenger", (req, res) => {
  if (loggedIn) {
    connection.query(
      "select * from PassengerDetails",
      (error, result, fields) => {
        if (error) throw error;
        res.render("deletePassenger", { data: result });
      }
    );
  } else {
    res.redirect("/");
  }
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
        console.log(result);
        res.render("./success", { message: message });
      }
    }
  );
});

//__________UPDATE PASSENGER DETAILS__________//
app.get("/update", (req, res) => {
  if (loggedIn) {
    res.render("update");
  } else {
    res.redirect("/");
  }
});

app.post("/update", (req, res) => {
  const PID = req.body.PID;
  const PFName = req.body.fname;
  const PLName = req.body.lname;
  const PhoneNo = req.body.number;
  const EmailID = req.body.email;
  connection.query(
    "UPDATE PassengerDetails SET PFName=" +
      connection.escape(PFName) +
      ",PLName=" +
      connection.escape(PLName) +
      ",PhoneNo=" +
      connection.escape(PhoneNo) +
      ",EmailID=" +
      connection.escape(EmailID) +
      "WHERE PID=" +
      connection.escape(PID),
    (error, result) => {
      if (error) throw error;
      else {
        res.render("success", {
          message: "Updated Passenger in Database succesfully",
        });
      }
    }
  );
});

//__________VIEW PASSENGER DETAILS__________//
app.get("/viewPassengerDetails", (req, res) => {
  if (loggedIn) {
    connection.query(
      "select * from PassengerDetails",
      (error, result, fields) => {
        if (error) throw error;
        res.render("./viewPassengerDetails", { data: result });
      }
    );
  } else {
    res.redirect("/");
  }
});

app.post("/viewPassengerDetails", (req, res) => {
  const pid = req.body.pid;
  connection.query(
    "SELECT * FROM PassengerDetails WHERE PID=" + connection.escape(pid),
    (error, result, fields) => {
      if (error) throw error;
      connection.query(
        "SELECT * FROM TravelRecord WHERE PID=" + connection.escape(pid),
        (error1, result1, fields1) => {
          if (error1) throw error1;
          connection.query(
            "SELECT * FROM Stations",
            (error2, result2, fields2) => {
              if (error2) throw error2;
              console.log(result1);
              res.render("passengerDetails", {
                data: result,
                data1: result1,
                data2: result2,
              });
            }
          );
        }
      );
    }
  );
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000");
});
