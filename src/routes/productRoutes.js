const express = require('express');
const {
  getProductsByLocation,
  addProduct,
  updateProductStock,
  getProductDetails,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();


router.get('/by-location', getProductsByLocation);


router.post('/add', authMiddleware, roleMiddleware('admin'), addProduct);
router.put('/update-stock', authMiddleware, roleMiddleware('admin'), updateProductStock);

router.get('/:productId', getProductDetails);

module.exports = router;
