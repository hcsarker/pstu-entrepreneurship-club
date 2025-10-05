const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, trim: true },
  department: { type: String, trim: true },
  avatar: { type: String, trim: true },
  socials: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

teamMemberSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
