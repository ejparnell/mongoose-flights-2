const Flight = require("../models/flight");
const airports = ['LGA', 'AUS', 'DFW', 'DEN', 'LAX', 'SAN'];

async function newFlight(req, res) {
  const newFlight = new Flight();
  // Obtain the default date
  const dt = newFlight.departs;
  // Format the date for the value attribute of the input
  let departsDate = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`;
  departsDate += `-${dt.getDate().toString().padStart(2, '0')}T${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`;
  res.render('flights/new', { departsDate: departsDate });
}


async function create(req, res) {
  req.body.timestamps = !!req.body.timestamps;
  
  try {
    const flightDoc = await Flight.create(req.body);
    console.log(flightDoc);
    
    res.redirect(`/flights/${flightDoc.id}`);
  } catch (err) {
    console.log(err);
    
    return res.send("err creating, check the terminal");
  }
}

async function updateDestination(req, res) {
  try {
    const flight = await Flight.findById(req.params.id);
    console.log('flight:', flight); 
    console.log('req.body:', req.body);
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
      console.log(errors)
      return res.render("flights/show", { flight, errors, airports });
    }
    // Update the flight's destination
    flight.destinations.push({
      airport,
      arrival,
    });
    // Save the updated flight to the database
    await flight.save();
    res.redirect(`/flights/${flight._id}`);
  } catch (err) {
    console.log(err);
    return res.send("Error finding/saving flight in database");
  }
}

async function index(req, res) {
  try {
    const flightDocs = await Flight.find({}).sort({ departs: 1 });
    console.log("found all flights\n", flightDocs);

    res.render("flights/index", { flights: flightDocs });
  } catch (err) {
    console.log(err);
    return res.send("Error finding flights in database");
  }
}

async function show(req, res) {
  console.log("these are the request parameters\n", req.params);
  try {
    const airports = ['LGA', 'AUS', 'DFW', 'DEN', 'LAX', 'SAN'];
    const flight = await Flight.findById(req.params.id);
    const departsDate = flight.departs.toISOString().slice(0, 16);
    console.log("this is the flight\n", flight);
    if (!flight) {
      return res.send("Flight not found");
    }

    // Exclude the flight airport and already used airports from the list
    const usedAirports = flight.destinations.map(d => d.airport);
    const availableAirports = airports.filter(a => !usedAirports.includes(a) && a !== flight.airport);

    res.render("flights/show", { airports, availableAirports, flight, departsDate });
  } catch (err) {
    console.log(err);
    return res.send("Error finding flight in database");
  }
}

module.exports = {
  newFlight,
  create,
  updateDestination,
  index,
  show,
};
