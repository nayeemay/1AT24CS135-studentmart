const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /api/users - Fetch all registered students (excluding passwords)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// PATCH /api/users/:id/block - Toggle user block status
router.patch('/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ _id: user._id, isBlocked: user.isBlocked });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update user status', error: err.message });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete user', error: err.message });
  }
});

module.exports = router;