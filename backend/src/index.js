// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: 'sqlite' });
});

// API routes
app.use('/api/sales', salesRoutes);

// Start server immediately (no in-memory preload)
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
