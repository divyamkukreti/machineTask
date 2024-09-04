const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
    const user = new User({ firstName, lastName, email, phoneNumber, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isAdminApproved) return res.status(403).json({ message: 'User not approved by admin' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error });
  }
};
