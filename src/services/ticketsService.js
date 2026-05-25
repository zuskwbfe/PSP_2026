const fileService = require('./fileService');

let dataFilePath;

const init = (filePath) => {
    dataFilePath = filePath;
};

// Получить все заявки с фильтрацией по статусу, приоритету и менеджеру
const findAll = ({ status, priority, manager } = {}) => {
    let tickets = fileService.readData(dataFilePath);

    if (status) {
        tickets = tickets.filter(t => t.status === status);
    }
    if (priority !== undefined) {
        tickets = tickets.filter(t => t.priority === parseInt(priority));
    }
    if (manager) {
        tickets = tickets.filter(t =>
            t.manager.toLowerCase().includes(manager.toLowerCase())
        );
    }

    return tickets;
};

// Получить одну заявку по ID
const findOne = (id) => {
    const tickets = fileService.readData(dataFilePath);
    return tickets.find(t => t.id == id) || null;
};

// Создать новую заявку
const create = (ticketData) => {
    const tickets = fileService.readData(dataFilePath);

    const newId = tickets.length > 0
        ? Math.max(...tickets.map(t => t.id)) + 1
        : 1;

    const newTicket = {
        id: newId,
        client:    ticketData.client,
        service:   ticketData.service,
        manager:   ticketData.manager,
        executor:  ticketData.executor  || '—',
        courier:   ticketData.courier   || '—',
        status:    ticketData.status    || 'Новая',
        priority:  ticketData.priority  ?? 3,
        cost:      ticketData.cost      ?? 0,
        desc:      ticketData.desc      || '',
        equipment: ticketData.equipment || '—'
    };

    tickets.push(newTicket);
    fileService.writeData(dataFilePath, tickets);
    return newTicket;
};

// Частичное обновление заявки по ID (PATCH)
const update = (id, ticketData) => {
    const tickets = fileService.readData(dataFilePath);
    const index = tickets.findIndex(t => t.id == id);

    if (index == -1) return null;

    tickets[index] = { ...tickets[index], ...ticketData, id };
    fileService.writeData(dataFilePath, tickets);
    return tickets[index];
};

// Удалить заявку по ID
const remove = (id) => {
    const tickets = fileService.readData(dataFilePath);
    const filtered = tickets.filter(t => t.id != id);

    if (filtered.length === tickets.length) return false;

    fileService.writeData(dataFilePath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };
