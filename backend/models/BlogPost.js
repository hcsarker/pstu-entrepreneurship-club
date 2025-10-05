const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  category: { type: String, trim: true },
  cover: { type: String, trim: true },
  excerpt: { type: String, trim: true },
  readTime: { type: Number, default: 5 },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

blogPostSchema.index({ date: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
