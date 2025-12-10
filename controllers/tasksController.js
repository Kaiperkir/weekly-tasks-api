const fs = require('fs');
const path = require('path');

const tasksPath = path.join(__dirname, '../data/tasks.json');
let tasks = [];

// Загрузка задач из файла
const loadTasks = () => {
  try {
    const data = fs.readFileSync(tasksPath, 'utf8');
    tasks = JSON.parse(data);
  } catch (e) {
    tasks = [];
  }
};

// Сохранение задач в файл
const saveTasks = () => {
  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
};

loadTasks();

// GET /api/tasks
const getAllTasks = (req, res) => {
  const { day, priority, completed } = req.query;
  let result = [...tasks];

  if (day) result = result.filter(t => t.day === day);
  if (priority) result = result.filter(t => t.priority === priority);
  if (completed !== undefined) {
    const bool = completed === 'true';
    result = result.filter(t => t.completed === bool);
  }

  res.json({ success: true, count: result.length, data: result });
};

// GET /api/tasks/:id
const getTaskById = (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ success: false, error: 'Задача не найдена' });
  }

  res.json({ success: true, data: task });
};

// POST /api/tasks
const createTask = (req, res) => {
  const { title, day, priority = 'medium' } = req.body;

  if (!title || !day) {
    return res.status(400).json({ success: false, error: 'title и day обязательны' });
  }

  const newTask = {
    id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title,
    day,
    priority,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();

  res.status(201).json({ success: true, data: newTask });
};

// PUT /api/tasks/:id
const updateTask = (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Задача не найдена' });
  }

  tasks[index] = { ...tasks[index], ...req.body };
  saveTasks();

  res.json({ success: true, data: tasks[index] });
};

// DELETE /api/tasks/:id
const deleteTask = (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Задача не найдена' });
  }

  tasks.splice(index, 1);
  saveTasks();

  res.json({ success: true, message: 'Задача удалена' });
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
