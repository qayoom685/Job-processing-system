const db = require('../db/mysql');

const createTask = async (req, res) => {
  try {
    const { type, text } = req.body;

    // 1 Validate input
    if (!type || !text) {
      return res.status(400).json({
        error: 'type and text are required'
      });
    }

    if (!['uppercase', 'reverse'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid task type'
      });
    }

    if (typeof text !== 'string') {
      return res.status(400).json({
        error: 'text must be a string'
      });
    }

    // 2 Insert task into DB
    const [result] = await db.execute(
      `INSERT INTO tasks (type, input_text)
       VALUES (?, ?)`,
      [type, text]
    );

    // 3 Return task ID
    return res.status(201).json({
      task_id: result.insertId,
      status: 'pending'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};


const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1 Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid task ID'
      });
    }

    // 2 Fetch task from DB
    const [rows] = await db.execute(
      `SELECT 
          id,
          type,
          input_text,
          status,
          result,
          error,
          created_at,
          updated_at
       FROM tasks
       WHERE id = ?`,
      [id]
    );

    // 3 Task not found
    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    // 4 Return task info
    return res.json(rows[0]);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
    createTask,
    getTaskById
};

