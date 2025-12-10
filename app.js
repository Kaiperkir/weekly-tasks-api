const express = require('express');
const path = require('path');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = 3000;

// Middleware для JSON
app.use(express.json());

// Middleware для URL-encoded форм
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Собственный middleware-логгер
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Маршруты API
app.use('/api/tasks', tasksRouter);

// Корневой маршрут
app.get('/', (req, res) => {
  res.send('Weekly Tasks API работает!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
