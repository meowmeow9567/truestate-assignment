const dotenv = require("dotenv");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createTable() {
  await pool.query(`
    DROP TABLE IF EXISTS sales;

    CREATE TABLE sales (
      id SERIAL PRIMARY KEY,

      customer_id TEXT,
      customer_name TEXT,
      phone_number TEXT,
      gender TEXT,
      age INTEGER,
      customer_region TEXT,
      customer_type TEXT,

      product_id TEXT,
      product_name TEXT,
      brand TEXT,
      product_category TEXT,
      tags TEXT,

      quantity INTEGER,
      price_per_unit NUMERIC,
      discount_percentage NUMERIC,
      total_amount NUMERIC,
      final_amount NUMERIC,

      date TEXT,
      payment_method TEXT,
      order_status TEXT,
      delivery_type TEXT,

      store_id TEXT,
      store_location TEXT,
      salesperson_id TEXT,
      employee_name TEXT
    );
  `);
}

async function importCsv(limit = 10000) {
  const filePath = path.join(__dirname, "..", "..", "data", "Retail_Sales_Dataset.csv");

  console.log("Importing limited rows:", limit);

  const stream = fs.createReadStream(filePath).pipe(csv());
  let count = 0;

  for await (const row of stream) {
    if (count >= limit) break;

    await pool.query(
      `
      INSERT INTO sales (
        customer_id, customer_name, phone_number, gender, age,
        customer_region, customer_type,
        product_id, product_name, brand, product_category, tags,
        quantity, price_per_unit, discount_percentage, total_amount, final_amount,
        date, payment_method, order_status, delivery_type,
        store_id, store_location, salesperson_id, employee_name
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17,
        $18, $19, $20, $21,
        $22, $23, $24, $25
      )
      `,
      [
        row["Customer ID"],
        row["Customer Name"],
        row["Phone Number"],
        row["Gender"],
        Number(row["Age"]),
        row["Customer Region"],
        row["Customer Type"],

        row["Product ID"],
        row["Product Name"],
        row["Brand"],
        row["Product Category"],
        row["Tags"],

        Number(row["Quantity"]),
        Number(row["Price per Unit"]),
        Number(row["Discount Percentage"]),
        Number(row["Total Amount"]),
        Number(row["Final Amount"]),

        row["Date"],
        row["Payment Method"],
        row["Order Status"],
        row["Delivery Type"],

        row["Store ID"],
        row["Store Location"],
        row["Salesperson ID"],
        row["Employee Name"],
      ]
    );

    count++;

    if (count % 1000 === 0) console.log(count, "rows inserted");
  }

  console.log("Total rows inserted:", count);
}

async function main() {
  try {
    await createTable();
    await importCsv();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

main();
