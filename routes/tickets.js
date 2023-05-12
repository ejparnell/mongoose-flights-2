const express = require('express');
const router = express.Router();
const flightsCtrl = require('../controllers/flights');
const ticketsCtrl = require('../controllers/tickets');

router.get('/flights/:id/tickets/new', ticketsCtrl.newTicket);

router.post('/flights/:id/tickets', ticketsCtrl.create);

router.delete('/flights/:id', ticketsCtrl.deleteTicket);

module.exports = router