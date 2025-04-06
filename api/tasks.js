const express = require('express');
const router = express.Router();
const { db } = require('../db/db');

// Get all tasks
router.get('/', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add new task
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  db.run(
    'INSERT INTO tasks (title) VALUES (?)',
    [title],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        id: this.lastID,
        title,
        completed: 0
      });
    }
  );
});

// Update task status
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  db.run(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    [completed ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

// Delete task
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM tasks WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    }
  );
});

module.exports = router;