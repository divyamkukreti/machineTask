const Order = require('../models/order');
const Product = require('../models/product');
const Warehouse = require('../models/warehouse');

exports.createOrder = async (req, res) => {
  const { userId, productId, quantity, userLocation } = req.body;
  try {
    const product = await Product.findOne({
      _id: productId,
      location: {
        $geoWithin: {
          $centerSphere: [[userLocation.lng, userLocation.lat], 10 / 6378.1], // 10 km radius
        },
      },
    });

    if (!product) return res.status(404).json({ message: 'Product not available in your location' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock' });

    const order = new Order({ user: userId, product: productId, quantity });
    await order.save();
    res.json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error });
  }
};
