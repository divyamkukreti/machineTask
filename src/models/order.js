const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

module.exports = mongoose.model('Order', orderSchema);
