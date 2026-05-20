const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

// GET /tickets?status=Новая&priority=2&manager=Смирнова
router.get('/', ticketsController.getAllTickets);

// GET /tickets/:id
router.get('/:id', ticketsController.getTicketById);

// POST /tickets
router.post('/', ticketsController.createTicket);

// PATCH /tickets/:id
router.patch('/:id', ticketsController.updateTicket);

// DELETE /tickets/:id
router.delete('/:id', ticketsController.deleteTicket);

module.exports = router;
