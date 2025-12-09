const dotenv = require("dotenv");
const { Client } = require("pg");

dotenv.config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    const res = await client.query("SELECT 1 AS value");
    console.log("Connected to Postgres! Test result:", res.rows[0]);
  } catch (err) {
    console.error("Error connecting to Postgres:", err);
  } finally {
    await client.end();
  }
}

main();
