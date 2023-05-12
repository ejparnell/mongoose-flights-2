const Flight = require("../models/flight");
const Ticket = require("../models/ticket");

function newTicket(req, res) {
  Flight.findById(req.params.id)
    .exec()
    .then((flight) => {
      if (!flight) {
        return res.send("Flight not found");
      }

      Ticket.find({ flight: flight._id })
        .exec()
        .then((tickets) => {
          res.render("tickets/new", {
            flight,
            tickets,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.send("Error finding tickets in database");
        });
    })
    .catch((err) => {
      console.log(err);
      return res.send("Error finding flight in database");
    });
}

function create(req, res) {
  console.log("Creating ticket");
  console.log(req.body); // check the value of req.body
  const ticket = new Ticket({
    seat: req.body.seat,
    price: req.body.price,
    flight: req.params.id,
  });
  ticket
    .save()
    .then(() => {
      res.redirect(`/flights/${req.params.id}`);
    })
    .catch((err) => {
      console.log(err, "error creating ticket");
      res.redirect(`/flights/${req.params.id}/tickets/new`);
    });
}

function deleteTicket(req, res) {
  Ticket.findById(req.params.id)
    .exec()
    .then((ticket) => {
      if (!ticket) {
        return res.send("Ticket not found");
      }
      Ticket.deleteOne({ _id: ticket._id }, (err) => {
        if (err) {
          console.log("error deleting ticket", err);
          return res.redirect("back");
        }
        res.redirect(`/flights/${ticket.flight}`);
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("back");
    });
}

module.exports = {
  newTicket,
  create,
  deleteTicket,
};
