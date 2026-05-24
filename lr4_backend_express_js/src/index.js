const express = require('express');
const path = require('path');
const productsRouter = require('./routes/products');
const productsService = require('./services/productsService');

const app = express();
const PORT = 3000;


const DATA_FILE_PATH = path.join(__dirname, 'data/products.json');

productsService.init(DATA_FILE_PATH);

// парсинг JSON
app.use(express.json());

// логирующий middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Обязательно вызываем next(), иначе запрос зависнет
});

app.use(express.static(path.join(__dirname, '..', 'public')));

// подключение маршрутов
app.use('/products', productsRouter);

// глобальная обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
