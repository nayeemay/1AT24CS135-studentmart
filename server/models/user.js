const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  usn: { type: String, required: true, unique: true },      // Added USN
  collegeName: { type: String, required: true },           // Added College Name
  course: { type: String, required: true },                  // Added Course (e.g. CSE)
  class: { type: String, default: '' },                    // e.g. 3rd Year
  section: { type: String, default: '' },                  // e.g. Section A
  profilePicture: { type: String, default: '' },           // Profile image URL
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);