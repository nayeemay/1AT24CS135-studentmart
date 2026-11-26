const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders - Save placed order to MongoDB
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order({
      orderId: req.body.id || 'ORD-' + Date.now(),
      user: req.body.user || undefined,
      customer: req.body.customer,
      items: (req.body.items || []).map((item) => ({
        productId: String(item.productId || item.id || ''),
        title: item.title,
        quantity: Number(item.quantity ?? item.qty ?? 1),
        price: Number(item.price)
      })),
      totalAmount: Number(req.body.totalAmount ?? req.body.total ?? 0),
      status: req.body.status || 'Placed'
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Failed to place order', error: err.message });
  }
});

// GET /api/orders - Fetch all orders for Admin
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email usn')
      .populate('items.product', 'title price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// PATCH /api/orders/:id/status - Update order status from Admin
router.patch('/:id/status', async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ orderId: req.params.id }, { _id: req.params.id }] }
      : { orderId: req.params.id };

    const updated = await Order.findOneAndUpdate(
      query,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update status', error: err.message });
  }
});

module.exports = router;