const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'studentmart_super_secret_key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all products
router.get('/', verifyToken, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a new product listing
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, price, category, stock, image, description } = req.body;
    const newProduct = new Product({
      name,
      price,
      category,
      stock: stock || 10,
      image,
      description,
      seller: req.user.userId
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;