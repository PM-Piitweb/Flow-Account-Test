const Product = require('../models/Product');
const Category = require('../models/Category');

const generateSKU = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  const prefix = category.skuPrefix;

  let nextNumber = 1;
  let sku;
  let exists = true;

  while (exists) {
    sku = `${prefix}${String(nextNumber).padStart(3, '0')}`;
    exists = await Product.findOne({ sku }); // เช็คว่ามี SKU นี้ใน DB หรือยัง
    if (exists) {
      nextNumber++;
    }
  }

  return sku;
};

module.exports = generateSKU;
