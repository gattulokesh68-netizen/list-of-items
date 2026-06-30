const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'items.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with schema
const initialize = () => {
  db.serialize(() => {
    // Create items table
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        votes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create votes table to track individual votes (optional, for analytics)
    db.run(`
      CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
      )
    `);

    console.log('Database initialized successfully');
  });
};

// Get all items
const getAllItems = (callback) => {
  db.all('SELECT * FROM items ORDER BY votes DESC, created_at DESC', callback);
};

// Get item by ID
const getItemById = (id, callback) => {
  db.get('SELECT * FROM items WHERE id = ?', [id], callback);
};

// Add new item
const addItem = (title, description, callback) => {
  db.run(
    'INSERT INTO items (title, description, votes) VALUES (?, ?, 0)',
    [title, description],
    function (err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, title, description, votes: 0 });
      }
    }
  );
};

// Increment vote for an item
const incrementVote = (itemId, callback) => {
  db.run(
    `UPDATE items SET votes = votes + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [itemId],
    function (err) {
      if (err) {
        callback(err, null);
      } else {
        // Also log the vote
        db.run('INSERT INTO votes (item_id) VALUES (?)', [itemId], (err) => {
          if (err) {
            callback(err, null);
          } else {
            db.get('SELECT * FROM items WHERE id = ?', [itemId], callback);
          }
        });
      }
    }
  );
};

// Delete item
const deleteItem = (itemId, callback) => {
  db.run('DELETE FROM items WHERE id = ?', [itemId], callback);
};

// Reset votes for an item
const resetVotes = (itemId, callback) => {
  db.run(
    'UPDATE items SET votes = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [itemId],
    callback
  );
};

module.exports = {
  db,
  initialize,
  getAllItems,
  getItemById,
  addItem,
  incrementVote,
  deleteItem,
  resetVotes
};
