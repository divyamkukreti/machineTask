const Product = require('../models/product');
const Warehouse = require('../models/warehouse');

// Controller to get products available within a user's location (10 km radius)
exports.getProductsByLocation = async (req, res) => {
  const { lat, lng } = req.query;  // Assuming latitude and longitude are passed as query parameters

  try {
    // Find products within 10 km of the user's location
    const products = await Product.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], 10 / 6378.1],  // 10 km radius
        },
      },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products available in your location' });
    }

    res.json(products);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching products', error });
  }
};

// Controller to add a product (Admin only)
exports.addProduct = async (req, res) => {
  const { name, description, price, stock, location } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      stock,
      location,
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error });
  }
};

// Controller to update a product's stock (Admin only)
exports.updateProductStock = async (req, res) => {
  const { productId, stock } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: { stock } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product stock updated successfully', product });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product stock', error });
  }
};

// Controller to get details of a single product
exports.getProductDetails = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching product details', error });
  }
};
