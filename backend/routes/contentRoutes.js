const express = require('express');
const router = express.Router();
const { listEvents, listProducts, listPosts, listStartups, listTeam, listAdvisors, seedContent } = require('../controllers/contentController');

router.get('/events', listEvents);
router.get('/products', listProducts);
router.get('/posts', listPosts);
router.get('/startups', listStartups);
router.get('/team', listTeam);
router.get('/advisors', listAdvisors);

router.post('/seed', seedContent);

module.exports = router;
