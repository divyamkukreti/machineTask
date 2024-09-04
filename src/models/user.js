const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: { type: String, unique: true },
  password: String,
  isAdminApproved: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
});

module.exports = mongoose.model('User', userSchema);
