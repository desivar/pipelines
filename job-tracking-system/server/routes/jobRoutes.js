const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobs');
const authMiddleware = require('../middleware/auth'); // Add authentication middleware

// Secure all job routes
router.use(authMiddleware);

// GET all jobs (now protected)
router.get('/', jobController.getJobs);

// CREATE new job (protected)
router.post('/', jobController.createJob);

// Add other job routes (update, delete) as needed...

module.exports = router;