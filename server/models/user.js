const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  usn: { type: String, required: true },
  collegeName: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);