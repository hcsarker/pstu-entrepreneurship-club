const Registration = require('../models/Registration');

exports.registerForEvent = async (req, res) => {
  try {
    const { name, email, phone, department, year, message, eventSlug, eventTitle } = req.body || {};
    if (!name || !email || !eventSlug) {
      return res.status(400).json({ error: 'Missing required fields', required: ['name','email','eventSlug'] });
    }
    const doc = await Registration.create({ name, email, phone, department, year, message, eventSlug, eventTitle });
    return res.status(201).json({ success: true, id: doc._id });
  } catch (err) {
    console.error('registerForEvent error:', err);
    return res.status(500).json({ error: 'Failed to register for event' });
  }
};
