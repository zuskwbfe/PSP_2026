const express = require('express');
const path = require('path');
const ticketsRouter = require('./routes/tickets');
const ticketsService = require('./services/ticketsService');

const app = express();
const PORT = 3000;

// Путь к файлу данных
const DATA_FILE_PATH = path.join(__dirname, 'data/tickets.json');

// Инициализация сервиса
ticketsService.init(DATA_FILE_PATH);

// 1. Парсинг JSON-тела запроса
app.use(express.json());

app.use(express.static(path.join(__dirname, '../dist')));

// 2. Логирование запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 3. Маршруты
app.use('/tickets', ticketsRouter);

// 4. Обработка 404 — маршрут не найден
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// 5. Глобальный обработчик ошибок (error handler — всегда 4 аргумента!)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// 6. Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
