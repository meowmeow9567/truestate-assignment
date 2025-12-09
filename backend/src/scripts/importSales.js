// backend/src/scripts/importSales.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const Sale = require('../models/Sale');

function toNumber(value) {
  if (value === undefined || value === null || value === '') return 0;
  // remove commas like "1,234.56"
  const cleaned = value.toString().replace(/,/g, '');
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}
function toDateSafe(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}


(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB connected');

    const filePath = path.join(__dirname, '../../data/Retail_Sales_Dataset.csv');


    console.log('📂 Reading CSV from:', filePath);

    // Optional: clear old data first
    await Sale.deleteMany({});
    console.log('🧹 Cleared existing sales collection');

    const batch = [];
    const BATCH_SIZE = 1000;

    const stream = fs
      .createReadStream(filePath)
      .pipe(csv())
      .on('data', row => {
        batch.push({
          transactionId: row['Transaction ID'],
          date: toDateSafe(row['Date']),

          customerId: row['Customer ID'],
          customerName: row['Customer Name'],
          phoneNumber: row['Phone Number'],
          gender: row['Gender'],
          age: toNumber(row['Age']),
          customerRegion: row['Customer Region'],
          customerType: row['Customer Type'],

          productId: row['Product ID'],
          productName: row['Product Name'],
          brand: row['Brand'],
          productCategory: row['Product Category'],
          tags: row['Tags']
            ? row['Tags']
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)
            : [],

          quantity: toNumber(row['Quantity']),
          pricePerUnit: toNumber(row['Price per Unit']),
          discountPercentage: toNumber(row['Discount Percentage']),
          totalAmount: toNumber(row['Total Amount']),
          finalAmount: toNumber(row['Final Amount']),

          paymentMethod: row['Payment Method'],
          orderStatus: row['Order Status'],
          deliveryType: row['Delivery Type'],

          storeId: row['Store ID'],
          storeLocation: row['Store Location'],

          salespersonId: row['Salesperson ID'],
          employeeName: row['Employee Name']
        });

        if (batch.length >= BATCH_SIZE) {
          stream.pause();
          Sale.insertMany(batch.splice(0, batch.length))
            .then(() => {
              console.log('💾 Inserted batch of', BATCH_SIZE);
              stream.resume();
            })
            .catch(err => {
              console.error('Insert error:', err);
              process.exit(1);
            });
        }
      })
      .on('end', async () => {
        try {
          if (batch.length) {
            await Sale.insertMany(batch);
            console.log('💾 Inserted final batch of', batch.length);
          }
          console.log('✅ Import completed successfully');
          await mongoose.disconnect();
          process.exit(0);
        } catch (err) {
          console.error('Final insert error:', err);
          process.exit(1);
        }
      })
      .on('error', err => {
        console.error('CSV read error:', err);
        process.exit(1);
      });
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
})();
