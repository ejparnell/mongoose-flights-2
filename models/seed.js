require("dotenv").config();
const mongoose = require("../config/database");
const Flight = require("./flight");
mongoose.connect(process.env.DATABASE_URL);

const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

const db = mongoose.connection;

db.on("open", () => {
  const startingFlights = [
    {
      airline: "American",
      airport: "AUS",
      flightNo: 9876,
      departs: oneYearFromNow,
    },
    {
      airline: "Southwest",
      airport: "DEN",
      flightNo: 5421,
      departs: oneYearFromNow,
    },
    {
      airline: "United",
      airport: "LAX",
      flightNo: 4321,
      departs: oneYearFromNow,
    },
    {
      airline: "Delta",
      airport: "SAN",
      flightNo: 8866,
      departs: oneYearFromNow,
    },
    {
      airline: "JetBlue",
      airport: "LGA",
      flightNo: 6543,
      departs: oneYearFromNow,
    },
  ];

  Flight.deleteMany({})
    .then(deletedFlights => {
        console.log("This is what deleteMany returns", deletedFlights);
      Flight.create(startingFlights)
        .then(data => {
          console.log("This is what was created", data);
          db.close();
        })
        .catch(err => {
          console.log(err);
          db.close();
        });
    })
    .catch(err => {
      console.log(err);
      db.close();
    });
});