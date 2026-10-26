const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' }, // URL or image link
  class: { type: String, default: '' },         // e.g., "3rd Year" or "B.Tech"
  section: { type: String, default: '' },       // e.g., "Section A"
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);