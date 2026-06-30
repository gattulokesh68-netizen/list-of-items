# Item Voting Application

A full-stack web application where users can view a list of items and vote on them. Each vote updates the vote count stored in a database, with votes automatically synced and items sorted by popularity.

## Features

- ✅ **View Items**: Display a list of items with titles, descriptions, and vote counts
- ✅ **Add Items**: Users can create new items with optional descriptions
- ✅ **Vote on Items**: Click the vote button to increment the vote count
- ✅ **Real-time Updates**: Vote counts update instantly and items re-sort by votes
- ✅ **Persistent Storage**: All votes and items are stored in SQLite database
- ✅ **Delete Items**: Remove items from the list
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite3 (easily scalable to PostgreSQL)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Architecture**: RESTful API

## Project Structure

```
list-of-items/
├── public/
│   ├── index.html          # HTML UI
│   ├── styles.css          # Styling
│   └── app.js              # Frontend JavaScript
├── routes/
│   └── items.js            # API route handlers
├── database/
│   ├── db.js               # Database operations
│   └── items.db            # SQLite database file (auto-created)
├── server.js               # Express server setup
├── package.json            # Dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/gattulokesh68-netizen/list-of-items.git
   cd list-of-items
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if needed (default settings work out of the box)

4. **Start the server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

5. **For development with auto-reload**
   ```bash
   npm run dev
   ```

## API Endpoints

### GET /api/items
Retrieve all items sorted by votes (descending)

**Response:**
```json
[
  {
    "id": 1,
    "title": "JavaScript Basics",
    "description": "Learn JavaScript fundamentals",
    "votes": 5,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:35:00Z"
  }
]
```

### GET /api/items/:id
Retrieve a specific item by ID

**Response:**
```json
{
  "id": 1,
  "title": "JavaScript Basics",
  "description": "Learn JavaScript fundamentals",
  "votes": 5,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:35:00Z"
}
```

### POST /api/items
Create a new item

**Request Body:**
```json
{
  "title": "New Item Title",
  "description": "Optional description"
}
```

**Response:** (201 Created)
```json
{
  "id": 2,
  "title": "New Item Title",
  "description": "Optional description",
  "votes": 0
}
```

### POST /api/items/:id/vote
Increment the vote count for an item

**Response:**
```json
{
  "id": 1,
  "title": "JavaScript Basics",
  "description": "Learn JavaScript fundamentals",
  "votes": 6,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:36:00Z"
}
```

### DELETE /api/items/:id
Delete an item

**Response:**
```json
{
  "message": "Item deleted successfully"
}
```

### POST /api/items/:id/reset-votes
Reset vote count to zero for an item

**Response:**
```json
{
  "id": 1,
  "title": "JavaScript Basics",
  "description": "Learn JavaScript fundamentals",
  "votes": 0,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:37:00Z"
}
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. View the current items in the list
3. **Add a new item**: Fill in the title (required) and description (optional), then click "Add Item"
4. **Vote on an item**: Click the "👍 Vote" button to increment votes for any item
5. **Delete an item**: Click the "🗑️ Remove" button to delete an item
6. Items automatically sort by vote count in descending order

## Database Schema

### items table
```sql
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  votes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### votes table (for analytics)
```sql
CREATE TABLE votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);
```

## Features in Detail

### Real-time Vote Updates
When a user votes, the database is immediately updated and the UI reflects the change. The items list automatically re-sorts to show items with the most votes first.

### Database Persistence
All votes and items are stored in SQLite. The database file (`items.db`) is created automatically on first run in the `database/` directory.

### Error Handling
- Input validation on the backend
- Proper HTTP status codes
- User-friendly error messages in the UI
- Database transaction safety

### Security
- HTML escaping to prevent XSS attacks
- Input validation and sanitization
- CORS support for cross-origin requests

## Future Enhancements

- [ ] User authentication
- [ ] Vote analytics dashboard
- [ ] Export/import functionality
- [ ] Item categories/tags
- [ ] Search and filter
- [ ] PostgreSQL integration for production
- [ ] WebSocket support for real-time updates
- [ ] Unit tests and integration tests

## Deployment

### Deployment to Heroku

1. Create a `Procfile`:
   ```
   web: npm start
   ```

2. Commit and push to Heroku:
   ```bash
   git push heroku main
   ```

### Deployment to Other Platforms

For production deployment, consider:
- Switching from SQLite to PostgreSQL
- Adding environment-based configuration
- Implementing rate limiting
- Adding logging and monitoring
- Using a process manager like PM2

## Troubleshooting

### Port already in use
Change the PORT in `.env` file or use:
```bash
PORT=3001 npm start
```

### Database errors
Delete `database/items.db` and restart the server to reinitialize the database

### CORS errors
Ensure the frontend is accessing the API at the correct URL (`/api/items` relative path is recommended)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Created by [gattulokesh68-netizen](https://github.com/gattulokesh68-netizen)

---

**Happy Voting! 🗳️**
