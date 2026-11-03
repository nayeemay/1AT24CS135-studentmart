const router = require("express").Router();
const Product = require("../models/Product"); // Adjust path if needed based on your folder structure

// @route   GET /api/products
// @desc    Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/products
// @desc    Create a new product
router.post("/", async (res, req) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;