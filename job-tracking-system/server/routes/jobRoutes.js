const express = require('express');
const router = express.Router();
const { getJobs, createJob } = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply authMiddleware only to routes that need protection
router.get('/', getJobs); // Public route
router.post('/', authMiddleware, createJob); // Protected route

module.exports = router;