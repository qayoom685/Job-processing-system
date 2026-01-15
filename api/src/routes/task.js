const express = require('express');
const router = express.Router();


const { createTask, getTaskById } = require('../controllers/taskController');

router.post('/task', createTask);
router.get('/task/:id', getTaskById);

module.exports = router;
