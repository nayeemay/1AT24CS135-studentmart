const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// 1. GET ALL PRODUCTS (Marketplace feed)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// 2. CREATE A NEW PRODUCT (Protected route)
router.post('/', authMiddleware, async (req, res) => {
  const { title, price, description, category } = req.body;

  try {
    if (!title || !price || !description) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const newProduct = new Product({
      title,
      price,
      description,
      category: category || 'General',
      postedBy: req.user.id, // comes from authMiddleware
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// 3. DELETE A PRODUCT (Only the user who posted it can delete it)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the logged-in user is the one who posted the product
    if (product.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

module.exports = router;