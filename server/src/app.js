const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
require('./models/index');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Роути
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Document Manager API працює!' });
});

sequelize.authenticate()
  .then(() => console.log('База даних підключена!'))
  .catch(err => console.error('Помилка підключення до БД:', err));

module.exports = app;