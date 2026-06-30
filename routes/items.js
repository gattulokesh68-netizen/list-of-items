const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET all items
router.get('/', (req, res) => {
  db.getAllItems((err, rows) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
    res.json(rows || []);
  });
});

// GET item by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID' });
  }

  db.getItemById(id, (err, row) => {
    if (err) {
      console.error('Error fetching item:', err);
      return res.status(500).json({ error: 'Failed to fetch item' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(row);
  });
});

// POST create new item
router.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  db.addItem(title.trim(), description?.trim() || '', (err, item) => {
    if (err) {
      console.error('Error creating item:', err);
      return res.status(500).json({ error: 'Failed to create item' });
    }
    res.status(201).json(item);
  });
});

// POST vote on an item
router.post('/:id/vote', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID' });
  }

  db.incrementVote(id, (err, item) => {
    if (err) {
      console.error('Error voting:', err);
      return res.status(500).json({ error: 'Failed to record vote' });
    }

    res.json(item);
  });
});

// DELETE item
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID' });
  }

  db.deleteItem(id, (err) => {
    if (err) {
      console.error('Error deleting item:', err);
      return res.status(500).json({ error: 'Failed to delete item' });
    }

    res.json({ message: 'Item deleted successfully' });
  });
});

// POST reset votes for an item
router.post('/:id/reset-votes', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid item ID' });
  }

  db.resetVotes(id, (err) => {
    if (err) {
      console.error('Error resetting votes:', err);
      return res.status(500).json({ error: 'Failed to reset votes' });
    }

    db.getItemById(id, (err, item) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch updated item' });
      }
      res.json(item);
    });
  });
});

module.exports = router;
