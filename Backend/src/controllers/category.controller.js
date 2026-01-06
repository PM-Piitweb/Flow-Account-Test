const Category = require('../models/Category');

// CREATE
const createCategory = async (req, res) => {
  try {
    const { name, skuPrefix } = req.body;
    const errors = [];

    if (!name || name.trim() === '') {
      errors.push('Category name must not be empty');
    }

    if (!skuPrefix || skuPrefix.trim() === '') {
      errors.push('SKU prefix is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const category = await Category.create({ name, skuPrefix });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Category name or SKU prefix already exists'
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ALL
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, skuPrefix } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name !== undefined) category.name = name;
    if (skuPrefix !== undefined) category.skuPrefix = skuPrefix;

    await category.save();

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
