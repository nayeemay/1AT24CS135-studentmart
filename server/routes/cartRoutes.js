const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
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

// Get User Cart
router.get('/', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart) {
      cart = { items: [] };
    }
    res.json(cart.items || cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add or Update Item in Cart
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [{ product: productId, quantity: quantity || 1 }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
      }
    }
    await cart.save();
    res.json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Remove Item from Cart
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId });
    if (cart) {
      cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
      await cart.save();
    }
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Checkout Cart -> Create Order
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const price = item.product ? item.product.price : 0;
      totalAmount += price * item.quantity;
      return {
        product: item.product ? item.product._id : null,
        productId: item.product ? String(item.product._id) : '',
        title: item.product ? item.product.title : 'Item',
        quantity: item.quantity,
        price: price
      };
    });

    const newOrder = new Order({
      orderId: 'ORD-' + Date.now(),
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      status: 'Placed'
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ user: req.user.userId });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Order History
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;