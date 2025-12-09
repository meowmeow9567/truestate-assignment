// backend/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();

// IMPORTANT: Render will set PORT, local fallback is 5050
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", db: "postgres" });
});

// Simple sales list with pagination
app.get("/api/sales", async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const offset = (page - 1) * limit;

  try {
    // 1) Fetch rows
    const dataResult = await pool.query(
      "SELECT * FROM sales ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    // 2) Fetch total count
    const countResult = await pool.query("SELECT COUNT(*) AS count FROM sales");

    // 3) Normalize tags so frontend gets an array
    const rows = dataResult.rows.map((row) => ({
      ...row,
      tags: row.tags
        ? String(row.tags)
            .split(",")
            .map((t) => t.trim())
        : [],
    }));

    res.json({
      success: true,
      total: Number(countResult.rows[0].count),
      page,
      limit,
      data: rows,
    });
  } catch (err) {
    console.error("❌ Error fetching sales", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message, // <— extra info for debugging
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
