// backend/src/models/Sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    transactionId: String,
    date: Date,

    customerId: String,
    customerName: String,
    phoneNumber: String,
    gender: String,
    age: Number,
    customerRegion: String,
    customerType: String,

    productId: String,
    productName: String,
    brand: String,
    productCategory: String,
    tags: [String],

    quantity: Number,
    pricePerUnit: Number,
    discountPercentage: Number,
    totalAmount: Number,
    finalAmount: Number,

    paymentMethod: String,
    orderStatus: String,
    deliveryType: String,

    storeId: String,
    storeLocation: String,

    salespersonId: String,
    employeeName: String
  },
  {
    collection: 'sales'
  }
);

module.exports = mongoose.model('Sale', saleSchema);
