const Database = require('better-sqlite3');
const db = new Database('urls.db');

// Create the table to store our mappings
db.prepare(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT UNIQUE,
    original_url TEXT
  )
`).run();

module.exports = db;