// backend/src/scripts/importToSqlite.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../db/sqlite');

function toNumber(value) {
  if (value === undefined || value === null || value === '') return 0;
  const cleaned = value.toString().replace(/,/g, '');
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

function toDateString(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString(); // store as ISO string
}

// 1. Create table
const createTableSQL = `
CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transactionId TEXT,
  date TEXT,
  customerId TEXT,
  customerName TEXT,
  phoneNumber TEXT,
  gender TEXT,
  age INTEGER,
  customerRegion TEXT,
  customerType TEXT,
  productId TEXT,
  productName TEXT,
  brand TEXT,
  productCategory TEXT,
  tags TEXT,
  quantity INTEGER,
  pricePerUnit REAL,
  discountPercentage REAL,
  totalAmount REAL,
  finalAmount REAL,
  paymentMethod TEXT,
  orderStatus TEXT,
  deliveryType TEXT,
  storeId TEXT,
  storeLocation TEXT,
  salespersonId TEXT,
  employeeName TEXT
);
`;

db.exec(createTableSQL);
console.log('✅ sales table ensured');

// Clear any existing data
db.exec('DELETE FROM sales');
console.log('🧹 Cleared existing sales rows');

// Prepare insert statement
const insertStmt = db.prepare(`
  INSERT INTO sales (
    transactionId, date,
    customerId, customerName, phoneNumber, gender, age, customerRegion, customerType,
    productId, productName, brand, productCategory, tags,
    quantity, pricePerUnit, discountPercentage, totalAmount, finalAmount,
    paymentMethod, orderStatus, deliveryType,
    storeId, storeLocation,
    salespersonId, employeeName
  ) VALUES (
    @transactionId, @date,
    @customerId, @customerName, @phoneNumber, @gender, @age, @customerRegion, @customerType,
    @productId, @productName, @brand, @productCategory, @tags,
    @quantity, @pricePerUnit, @discountPercentage, @totalAmount, @finalAmount,
    @paymentMethod, @orderStatus, @deliveryType,
    @storeId, @storeLocation,
    @salespersonId, @employeeName
  )
`);

const insertMany = db.transaction(rows => {
  for (const row of rows) {
    insertStmt.run(row);
  }
});

const csvPath = path.join(__dirname, '../../data/Retail_Sales_Dataset.csv');
console.log('📂 Reading CSV from:', csvPath);

const BATCH_SIZE = 2000;
let batch = [];
let count = 0;

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', raw => {
    const row = {
      transactionId: raw['Transaction ID'],
      date: toDateString(raw['Date']),

      customerId: raw['Customer ID'],
      customerName: raw['Customer Name'],
      phoneNumber: raw['Phone Number'],
      gender: raw['Gender'],
      age: toNumber(raw['Age']),
      customerRegion: raw['Customer Region'],
      customerType: raw['Customer Type'],

      productId: raw['Product ID'],
      productName: raw['Product Name'],
      brand: raw['Brand'],
      productCategory: raw['Product Category'],
      tags: raw['Tags'] || '',

      quantity: toNumber(raw['Quantity']),
      pricePerUnit: toNumber(raw['Price per Unit']),
      discountPercentage: toNumber(raw['Discount Percentage']),
      totalAmount: toNumber(raw['Total Amount']),
      finalAmount: toNumber(raw['Final Amount']),

      paymentMethod: raw['Payment Method'],
      orderStatus: raw['Order Status'],
      deliveryType: raw['Delivery Type'],

      storeId: raw['Store ID'],
      storeLocation: raw['Store Location'],

      salespersonId: raw['Salesperson ID'],
      employeeName: raw['Employee Name']
    };

    batch.push(row);
    if (batch.length >= BATCH_SIZE) {
      insertMany(batch);
      count += batch.length;
      console.log(`💾 Inserted ${count} rows...`);
      batch = [];
    }
  })
  .on('end', () => {
    if (batch.length) {
      insertMany(batch);
      count += batch.length;
    }
    console.log(`✅ Import completed. Total rows inserted: ${count}`);
  })
  .on('error', err => {
    console.error('❌ CSV read error:', err);
  });
