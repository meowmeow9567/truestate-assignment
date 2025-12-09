// backend/src/config/db.js
require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env');
    throw new Error('MONGODB_URI missing');
  }

  // Log URI without credentials (for debugging)
  const safeUri = uri.replace(/\/\/.*@/, '//<credentials>@');
  console.log('🔌 Attempting MongoDB connection to:', safeUri);

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error (full details below):');
    console.error(err); // shows real cause, not just generic message
    throw err;
  }
}

module.exports = connectDB;
