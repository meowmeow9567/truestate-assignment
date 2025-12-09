// backend/src/db/sqlite.js
const Database = require('better-sqlite3');
const path = require('path');

// DB file: backend/src/database/sales.db
const dbPath = path.join(__dirname, '../database/sales.db');

// Ensure folder exists (in case)
const fs = require('fs');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);

// Helpful pragma (optional)
db.pragma('journal_mode = WAL');

module.exports = db;
