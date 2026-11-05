const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentmart';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
try {
  const authRoutes = require('./routes/authRoutes'); // Matches your authRoutes.js file
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded successfully');
} catch (e) {
  console.log('Auth routes error:', e.message);
}

try {
const productRoutes = require('./routes/productRoutes');
  app.use('/api/products', productRoutes);
  console.log('Product routes loaded successfully');
} catch (e) {
  console.log('Product routes error:', e.message);
}

// Root test route
app.get('/', (req, res) => {
  res.send('StudentMart Backend is running smoothly!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});