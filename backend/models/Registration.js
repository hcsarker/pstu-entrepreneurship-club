const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String },
  year: { type: String },
  message: { type: String },
  eventSlug: { type: String, required: true, index: true },
  eventTitle: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
