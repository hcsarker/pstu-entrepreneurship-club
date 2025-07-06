const express = require('express');
const router = express.Router();
const { joinClub } = require('../controllers/memberController');

router.post('/join', joinClub);

module.exports = router;
