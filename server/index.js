// server/index.js
// Entry point for the wedding invitation backend.

const path = require("path");
const express = require("express");
const cors = require("cors");

const wishesRouter = require("./routes/wishes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/wishes", wishesRouter);

// Serve the static frontend
app.use(express.static(path.join(__dirname, "..", "public")));

// Fallback to index.html for the single-page invitation
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Wedding invitation server running at http://localhost:${PORT}`);
});
