const User = require('../models/user');
const Product = require('../models/product');
const Warehouse = require('../models/warehouse');
const Order = require('../models/order');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error });
  }
};

exports.getUserList = async (req, res) => {
  const { search } = req.query;
  try {
    const query = {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ],
    };
    const users = await User.find(query);
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching users', error });
  }
};

exports.manageUser = async (req, res) => {
  const { userId, action } = req.body;
  try {
    let update = {};
    switch (action) {
      case 'approve':
        update = { isAdminApproved: true };
        break;
      case 'block':
        update = { status: 'blocked' };
        break;
      case 'activate':
        update = { status: 'active' };
        break;
      case 'delete':
        await User.findByIdAndDelete(userId);
        return res.json({ message: 'User deleted successfully' });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    await User.findByIdAndUpdate(userId, update);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
};

exports.addProduct = async (req, res) => {
  const { name, stock, price, warehouseId } = req.body;
  try {
    const product = new Product({ name, stock, price });
    await product.save();

    await Warehouse.findByIdAndUpdate(warehouseId, { $push: { products: product._id } });
    res.json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error });
  }
};

exports.manageStock = async (req, res) => {
  const { orderId, action } = req.body;
  try {
    const order = await Order.findById(orderId).populate('product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (action === 'accept') {
      if (order.product.stock < order.quantity) {
        return res.status(400).json({ message: 'Not enough stock to fulfill the order' });
      }
      order.product.stock -= order.quantity;
      await order.product.save();
      order.status = 'accepted';
    } else if (action === 'reject') {
      order.status = 'rejected';
    }
    await order.save();
    res.json({ message: 'Order processed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error managing order', error });
  }
};
