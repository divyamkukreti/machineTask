const express = require('express');
const {
  login,
  getUserList,
  manageUser,
  addProduct,
  manageStock,
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/login', login);

router.get('/users', authMiddleware, roleMiddleware('admin'), getUserList);


router.post('/manage-user', authMiddleware, roleMiddleware('admin'), manageUser);

router.post('/add-product', authMiddleware, roleMiddleware('admin'), addProduct);


router.post('/manage-stock', authMiddleware, roleMiddleware('admin'), manageStock);

module.exports = router;
