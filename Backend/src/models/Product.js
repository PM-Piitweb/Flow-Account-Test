const mongoose = require('mongoose');

const PRODUCT_CATEGORIES = [
  'FOOD',
  'BEVERAGE',
  'UTILITY',
  'CLOTHING'
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true,
      min: 0.01
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      enum: PRODUCT_CATEGORIES
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
