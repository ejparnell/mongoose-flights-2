const Flight = require("../models/flight");
const airports = ["LGA", "AUS", "DFW", "DEN", "LAX", "SAN"];
const Ticket = require("../models/ticket");

function newFlight(req, res) {
  const newFlight = new Flight();
  // Obtain the default date
  const dt = newFlight.departs;
  // Format the date for the value attribute of the input
  let departsDate = `${dt.getFullYear()}-${(dt.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  departsDate += `-${dt.getDate().toString().padStart(2, "0")}T${dt
    .getHours()
    .toString()
    .padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}`;
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
      res.send("err creating, check the terminal");
    });
}

function updateDestination(req, res) {
  Flight.findById(req.params.id)
    .then((flight) => {
      console.log("flight:", flight);
      console.log("req.body:", req.body);
      if (!flight) {
        return res.send("Flight not found");
      }
      // Validate destination data
      const { airport, arrival } = req.body;
      const errors = {};
      if (!airport) {
        errors.airport = "Airport is required";
      }
      if (!arrival) {
        errors.arrival = "Arrival time is required";
      }
      if (Object.keys(errors).length > 0) {
        console.log(errors);
        return res.render("flights/show", { flight, errors, airports });
      }
      // Update the flight's destination
      flight.destinations.push({
        airport,
        arrival,
      });
      // Save the updated flight to the database
      return flight.save();
    })
    .then(() => {
      res.redirect(`/flights/${req.params.id}`);
    })
    .catch((err) => {
      console.log(err);
      return res.send("Error finding/saving flight in database");
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
      return res.send("Error finding flights in database");
    });
}

function show(req, res) {
  console.log("these are the request parameters\n", req.params);
  Flight.findById(req.params.id)
    .then((flight) => {
      const departsDate = flight.departs.toISOString().slice(0, 16);
      console.log("this is the flight\n", flight);

      if (!flight) {
        return res.send("Flight not found");
      }

      const usedAirports = flight.destinations.map((d) => d.airport);
      const availableAirports = airports.filter(
        (a) => !usedAirports.includes(a) && a !== flight.airport
      );

      Ticket.find({ flight: flight._id }).then((tickets) => {
        res.render("flights/show", {
          title: "Flight Details",
          flight,
          tickets,
          airports,
          usedAirports,
          availableAirports,
          departsDate,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.send("Error finding flight in database");
    });
}

module.exports = {
  newFlight,
  create,
  updateDestination,
  index,
  show,
};
