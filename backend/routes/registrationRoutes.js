const express = require('express');
const router = express.Router();
const { registerForEvent } = require('../controllers/registrationController');

// POST /api/events/register - Create a registration entry
router.post('/events/register', registerForEvent);

module.exports = router;
