// backend/src/config/db.js
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("📦 Connected to PostgreSQL Database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected Postgres error", err);
  process.exit(-1);
});

module.exports = pool;
