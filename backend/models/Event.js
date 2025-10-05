const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  location: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  type: { type: String, enum: ['upcoming', 'past'], required: true },
  cover: { type: String, trim: true },
  excerpt: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

eventSchema.index({ date: -1 });

module.exports = mongoose.model('Event', eventSchema);
