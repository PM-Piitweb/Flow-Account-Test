const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  sellProduct,
  searchProducts,
  bulkPriceUpdate,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');


router.post('/', createProduct);
router.get('/', getProducts);
router.get('/search', searchProducts);
router.post('/sell', sellProduct);
router.put('/bulk-price-update', bulkPriceUpdate);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);


module.exports = router;
