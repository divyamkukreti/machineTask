const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  stock: Number,
  price: Number,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], 
  },
});

productSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', productSchema);

