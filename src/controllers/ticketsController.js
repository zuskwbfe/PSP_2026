const ticketsService = require('../services/ticketsService');

// GET /tickets — список с фильтрацией
const getAllTickets = (req, res) => {
    const { status, priority, manager } = req.query;
    const tickets = ticketsService.findAll({ status, priority, manager });
    res.status(200).json(tickets);
};

// GET /tickets/:id — одна запись
const getTicketById = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    const ticket = ticketsService.findOne(id);

    if (!ticket) {
        return res.status(404).json({ error: 'Заявка не найдена' });
    }

    res.status(200).json(ticket);
};

// POST /tickets — создание
const createTicket = (req, res) => {
    const { client, service, manager } = req.body;

    if (!client || !service || !manager) {
        return res.status(400).json({
            error: 'Обязательные поля: client, service, manager'
        });
    }

    const newTicket = ticketsService.create(req.body);
    res.status(201).json(newTicket);
};

// PATCH /tickets/:id — частичное обновление
const updateTicket = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    const updated = ticketsService.update(id, req.body);

    if (!updated) {
        return res.status(404).json({ error: 'Заявка не найдена' });
    }

    res.status(200).json(updated);
};

// DELETE /tickets/:id — удаление
const deleteTicket = (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID должен быть числом' });
    }

    const success = ticketsService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Заявка не найдена' });
    }

    res.status(204).send();
};

module.exports = {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket
};
