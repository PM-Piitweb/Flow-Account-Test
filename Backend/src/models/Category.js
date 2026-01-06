const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    skuPrefix: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      minlength: 2,
      maxlength: 10
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Category', categorySchema);
