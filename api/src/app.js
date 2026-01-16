const express = require('express');
require('dotenv').config();
const app = express();
const db = require('./db/mysql');
const taskRoutes = require('./routes/task');

app.use(express.json());

app.get('/db-test', async (req, res) => {
  const [rows] = await db.query('SELECT 1');
  res.json({ db: 'connected' });
});

app.use('/', taskRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Hello' });
});


module.exports = app;
