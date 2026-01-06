const Product = require('../models/Product');
const generateSKU = require('../utils/skuGenerator');

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const errors = [];

    if (!name || name.trim() === '') {
    errors.push('Product name must not be empty');
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

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: 'Quantity must be greater than 0'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: 'Insufficient stock'
      });
    }

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

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        message: 'Keyword is required'
      });
    }

    const regex = new RegExp(keyword, 'i'); // case-insensitive

    const products = await Product.find({
      $or: [
        { name: regex },
        { sku: regex }
      ]
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const bulkPriceUpdate = async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        message: 'Request body must be a non-empty array'
      });
    }

    let successCount = 0;

    for (const item of updates) {
      const { productId, newPrice } = item;

      if (!productId || newPrice === undefined || newPrice <= 0) {
        continue; // ข้ามอันที่ข้อมูลไม่ valid
      }

      const result = await Product.findByIdAndUpdate(
        productId,
        { price: newPrice },
        { new: true }
      );

      if (result) {
        successCount++;
      }
    }

    res.json({
      message: 'Bulk price update completed',
      updatedCount: successCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, stock, category } = req.body;

    const errors = [];

    if (name !== undefined && name.trim() === '') {
      errors.push('Product name must not be empty');
    }

    if (price !== undefined && price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (stock !== undefined && stock < 0) {
      errors.push('Stock must be >= 0');
    }

    if (category !== undefined && category === '') {
      errors.push('Category is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // update เฉพาะ field ที่ส่งมา
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createProduct,
  getProducts,
  sellProduct,
  searchProducts,
  bulkPriceUpdate,
  updateProduct,
  deleteProduct
};


