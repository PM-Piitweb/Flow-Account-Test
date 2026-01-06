const Product = require('../models/Product');
const generateSKU = require('../utils/skuGenerator');

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const errors = [];

    if (!name || name.trim().length < 3) {
      errors.push('Product name must be at least 3 characters');
    }

    if (price === undefined || price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (stock === undefined || stock < 0) {
      errors.push('Stock must be >= 0');
    }

    if (!category) {
      errors.push('Category is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const sku = await generateSKU(category);

    const product = await Product.create({
      name,
      sku,
      price,
      stock,
      category
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const sellProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // 1. quantity > 0 ?
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: 'Quantity must be greater than 0'
      });
    }

    // 2. มีสินค้าหรือไม่
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // 3. stock เพียงพอหรือไม่
    if (product.stock < quantity) {
      return res.status(400).json({
        message: 'Insufficient stock'
      });
    }

    // 4. ตัด stock
    product.stock -= quantity;
    await product.save();

    res.json({
      message: 'Product sold successfully',
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createProduct,
  getProducts,
  sellProduct
};
