// // backend/src/index.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');

// const salesRoutes = require('./routes/salesRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'ok', db: 'sqlite' });
// });

// // API routes
// app.use('/api/sales', salesRoutes);

// // Start server immediately (no in-memory preload)
// app.listen(PORT, () => {
//   console.log(`🚀 Backend server running on port ${PORT}`);
// });


// backend/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // ⬅ PostgreSQL

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", db: "postgres" });
});

// List sales (basic pagination)
app.get("/api/sales", async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "20", 10);
  const offset = (page - 1) * limit;

  try {
    const dataResult = await pool.query(
      "SELECT * FROM sales ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const countResult = await pool.query("SELECT COUNT(*) AS count FROM sales");

    res.json({
      success: true,
      total: Number(countResult.rows[0].count),
      page,
      limit,
      data: dataResult.rows,
    });
  } catch (err) {
    console.error("❌ Error fetching sales", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});

