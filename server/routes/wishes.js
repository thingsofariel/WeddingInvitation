// server/routes/wishes.js
// REST endpoints for submitting and listing RSVP / guest wishes.

const express = require("express");
const router = express.Router();
const db = require("../db/database");

// GET /api/wishes?page=1&limit=10
// Returns paginated wishes (newest first) plus attendance totals.
router.get("/", (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const offset = (page - 1) * limit;

  const totalRow = db.prepare("SELECT COUNT(*) AS count FROM wishes").get();
  const hadirRow = db
    .prepare("SELECT COALESCE(SUM(guest_count), 0) AS total FROM wishes WHERE attendance = 'hadir'")
    .get();
  const tidakHadirRow = db
    .prepare("SELECT COUNT(*) AS total FROM wishes WHERE attendance = 'tidak_hadir'")
    .get();

  const rows = db
    .prepare(
      "SELECT id, name, attendance, guest_count, message, created_at FROM wishes ORDER BY created_at DESC LIMIT ? OFFSET ?"
    )
    .all(limit, offset);

  res.json({
    data: rows,
    pagination: {
      page,
      limit,
      total: totalRow.count,
      totalPages: Math.ceil(totalRow.count / limit) || 1,
    },
    summary: {
      hadir: hadirRow.total,
      tidakHadir: tidakHadirRow.total,
    },
  });
});

// POST /api/wishes
// Body: { name, attendance, guestCount, message }
router.post("/", (req, res) => {
  const { name, attendance, guestCount, message } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Name must be at least 2 characters." });
  }
  if (!["hadir", "tidak_hadir"].includes(attendance)) {
    return res.status(400).json({ error: "Attendance must be 'hadir' or 'tidak_hadir'." });
  }
  if (!message || typeof message !== "string" || message.trim().length < 2) {
    return res.status(400).json({ error: "Message must be at least 2 characters." });
  }

  const count = Number.isInteger(guestCount) && guestCount > 0 ? guestCount : 1;

  const stmt = db.prepare(
    "INSERT INTO wishes (name, attendance, guest_count, message) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(name.trim(), attendance, count, message.trim());

  const inserted = db
    .prepare("SELECT id, name, attendance, guest_count, message, created_at FROM wishes WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json({ data: inserted });
});

module.exports = router;
