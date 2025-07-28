const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  description: { type: String },
  countInStock: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);
