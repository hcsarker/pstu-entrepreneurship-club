const express = require('express');
const router = express.Router();
const { joinClub, getAllMembers } = require('../controllers/memberController');

// POST /api/join - Member registration
router.post('/join', joinClub);

// GET /api/members - Get all members (for future admin use)
router.get('/members', getAllMembers);

module.exports = router;
