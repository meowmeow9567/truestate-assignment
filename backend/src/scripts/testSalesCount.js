const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  try {
    const result = await pool.query("SELECT COUNT(*) AS count FROM sales");
    console.log("Rows in sales table:", result.rows[0].count);
  } catch (err) {
    console.error("Error running test query:", err);
  } finally {
    await pool.end();
  }
}

main();
