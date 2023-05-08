const Flight = require("../models/flight");

function newFlight(req, res) {
  const newFlight = new Flight();
  const dt = newFlight.departs;
  let departsDate = `${dt.getFullYear()}-${(dt.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  departsDate += `-${dt.getDate().toString().padStart(2, "0")}T${dt
    .toTimeString()
    .slice(0, 5)}`;

  res.render("flights/new", { departsDate: departsDate });
}

function create(req, res) {
  req.body.timestamps = !!req.body.timestamps;

  Flight.create(req.body)

    .then((flightDoc) => {
      console.log(flightDoc);

      res.redirect(`/flights/${flightDoc.id}`);
    })
    .catch((err) => {
      console.log(err);

      return res.send("err creating, check the terminal");
    });
}

function index(req, res) {
  Flight.find({})
    .sort({ departs: 1 })
    .then((flightDocs) => {
      console.log("found all flights\n", flightDocs);

      res.render("flights/index", { flights: flightDocs });
    })
    .catch((err) => {
      console.log(err);

      return res.send("err creating, check the terminal");
    });
}

function show(req, res) {
  console.log("these are the request parameters\n", req.params);
  Flight.findById(req.params.id)
    .then((flight) => {
      console.log("this is the flight\n", flight);
      if (!flight) {
        return res.send("Flight not found");
      }
      res.render("flights/show", { flight: flight });
    })
    .catch((err) => {
      console.log(err);

      return res.send("err creating, check the terminal");
    });
}

module.exports = {
  newFlight,
  create,
  index,
  show,
};
