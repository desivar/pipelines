const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getJobs, createJob } = require('../controllers/jobController');

// These will work with your existing frontend
router.get('/', auth, getJobs);       // Keeps auth structure
router.post('/', auth, createJob);    // But uses simplified middleware

module.exports = router;