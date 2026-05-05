const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
require('./models/index');

const authRoutes = require('./routes/auth.routes');
const documentsRoutes = require('./routes/documents.routes');
const tagsRoutes = require('./routes/tags.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/tags', tagsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Document Manager API працює!' });
});

sequelize.authenticate()
  .then(() => console.log('База даних підключена!'))
  .catch(err => console.error('Помилка підключення до БД:', err));

module.exports = app;