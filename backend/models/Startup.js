const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  tagline: { type: String, trim: true },
  stage: { type: String, trim: true },
  cover: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

startupSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Startup', startupSchema);
