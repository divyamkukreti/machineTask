const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], 
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

warehouseSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Warehouse', warehouseSchema);
