const Database = require('better-sqlite3');
// This creates a file named 'urls.db' in your project folder
const db = new Database('urls.db');

// Create the table structure if it doesn't already exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE,
    original_url TEXT
  )
`).run();

module.exports = db;