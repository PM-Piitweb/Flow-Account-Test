const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  sellProduct
} = require('../controllers/product.controller');

router.post('/', createProduct);
router.get('/', getProducts);
router.post('/sell', sellProduct);

module.exports = router;
