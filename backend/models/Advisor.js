const mongoose = require('mongoose');

const advisorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  department: { type: String, trim: true },
  avatar: { type: String, trim: true },
  bio: { type: String, trim: true },
  session: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

advisorSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Advisor', advisorSchema);
