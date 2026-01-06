const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');

router.post('/', createCategory);
router.get('/', getCategories);
router.put('/:categoryId', updateCategory);
router.delete('/:categoryId', deleteCategory);

module.exports = router;
