// server/db/database.js
// SQLite database setup for the wedding invitation site.
// Stores RSVP confirmations and guest wishes/comments.

const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "invitation.db");
const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

// Table for RSVP + wishes. Each submission is one row:
// the guest's name, attendance status, number of guests, and an optional message.
db.exec(`
  CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    attendance TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir')),
    guest_count INTEGER NOT NULL DEFAULT 1,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
