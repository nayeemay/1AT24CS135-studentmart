const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // Optional if you use hashing, or store plain text if your project uses plain text passwords

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, profilePicture, class: studentClass, section } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new user (If you use bcrypt, hash password here: await bcrypt.hash(password, 10))
    const newUser = new User({
      fullName,
      email,
      password,
      profilePicture,
      class: studentClass,
      section
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password (compare plain text or use bcrypt.compare if hashed)
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;