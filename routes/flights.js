const express = require("express");
const router = express.Router();
const flightCtrl = require("../controllers/flights");

/* GET flights listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get("/new", flightCtrl.newFlight);

router.get("/", flightCtrl.index);

router.post("/", flightCtrl.create);

router.post("/:id/destination", flightCtrl.updateDestination);

router.get("/:id", flightCtrl.show);

module.exports = router;
