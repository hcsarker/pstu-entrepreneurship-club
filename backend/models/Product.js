const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, trim: true },
  badge: { type: String, trim: true },
  img: { type: String, trim: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
