// jobRoutes.js (simplified)
const express = require('express');
const router = express.Router();
const {
  getJobs,
  createJob
} = require('../controllers/jobController');

router.route('/')
  .get(getJobs)       // No middleware
  .post(createJob);   // No middleware

module.exports = router;