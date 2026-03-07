const express = require('express');
const router = express.Router();
const { adminLogin, setupAdmin, listTeam, createTeam, updateTeam, deleteTeam, listAdvisors, createAdvisor, updateAdvisor, deleteAdvisor } = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');

// Auth
router.post('/login', adminLogin);
// One-time setup (dev only or with ADMIN_SETUP_KEY)
router.post('/setup', setupAdmin);

// TEAM (protected)
router.get('/team', requireAuth, listTeam);
router.post('/team', requireAuth, createTeam);
router.put('/team/:id', requireAuth, updateTeam);
router.delete('/team/:id', requireAuth, deleteTeam);

// ADVISORS (protected)
router.get('/advisors', requireAuth, listAdvisors);
router.post('/advisors', requireAuth, createAdvisor);
router.put('/advisors/:id', requireAuth, updateAdvisor);
router.delete('/advisors/:id', requireAuth, deleteAdvisor);

module.exports = router;
