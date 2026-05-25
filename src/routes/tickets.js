const express = require('express');
const router = express.Router();
const ticketsService = require('../services/ticketsService');

// GET /tickets?status=...&manager=...&priority=...
router.get('/', (req, res) => {
    const { status, manager, priority } = req.query;
    const data = ticketsService.findAll({ status, manager, priority });
    res.json(data);
});

// GET /tickets/:id
router.get('/:id', (req, res) => {
    const ticket = ticketsService.findOne(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Заявка не найдена' });
    res.json(ticket);
});

// POST /tickets
router.post('/', (req, res) => {
    const { client, service, manager } = req.body;
    if (!client || !service || !manager) {
        return res.status(400).json({ error: 'Обязательные поля: client, service, manager' });
    }
    try {
        const created = ticketsService.create(req.body);
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /tickets/:id
router.patch('/:id', (req, res) => {
    try {
        const updated = ticketsService.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ error: 'Заявка не найдена' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /tickets/:id
router.delete('/:id', (req, res) => {
    const removed = ticketsService.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Заявка не найдена' });
    res.status(204).send();
});

module.exports = router;
