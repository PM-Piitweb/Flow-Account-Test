const Product = require('../models/Product');

const CATEGORY_PREFIX_MAP = {
  FOOD: 'FOOD',
  BEVERAGE: 'BEV',
  UTILITY: 'UTIL',
  CLOTHING: 'CLOTH'
};

async function generateSKU(category) {
  const prefix = CATEGORY_PREFIX_MAP[category];

  if (!prefix) {
    throw new Error('Invalid category');
  }

  const count = await Product.countDocuments({ category });

  const runningNumber = String(count + 1).padStart(3, '0');

  return `${prefix}${runningNumber}`;
}

module.exports = generateSKU;
