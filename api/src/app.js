const express = require('express');
require('dotenv').config();
const app = express();
const db = require('./db/mysql');

app.use(express.json());

app.get('/db-test', async (req, res) => {
  const [rows] = await db.query('SELECT 1');
  res.json({ db: 'connected' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


module.exports = app;
