// backend/src/utils/dataLoader.js
const db = require('../db/sqlite');

let SALES_DATA = null;

/**
 * Load sales data from SQLite into memory once at server startup
 * This fulfills the requirement of using a DB while avoiding CSV parsing every time
 */
async function loadSalesData() {
  if (SALES_DATA) return;

  console.log("📦 Loading sales data from SQLite...");

  const rows = db.prepare("SELECT * FROM sales").all();

  SALES_DATA = rows.map(r => ({
    transactionId: r.transactionId,
    date: r.date ? new Date(r.date) : null,

    customerId: r.customerId,
    customerName: r.customerName,
    phoneNumber: r.phoneNumber,
    gender: r.gender,
    age: r.age,
    customerRegion: r.customerRegion,
    customerType: r.customerType,

    productId: r.productId,
    productName: r.productName,
    brand: r.brand,
    productCategory: r.productCategory,
    tags: r.tags
      ? r.tags.split(",").map(t => t.trim())
      : [],

    quantity: r.quantity,
    pricePerUnit: r.pricePerUnit,
    discountPercentage: r.discountPercentage,
    totalAmount: r.totalAmount,
    finalAmount: r.finalAmount,

    paymentMethod: r.paymentMethod,
    orderStatus: r.orderStatus,
    deliveryType: r.deliveryType,

    storeId: r.storeId,
    storeLocation: r.storeLocation,

    salespersonId: r.salespersonId,
    employeeName: r.employeeName
  }));

  console.log(`📊 Loaded ${SALES_DATA.length} records from SQLite DB`);
}

function getSalesData() {
  if (!SALES_DATA) {
    throw new Error("Sales data not loaded yet. Call loadSalesData() before using.");
  }
  return SALES_DATA;
}

module.exports = { loadSalesData, getSalesData };
