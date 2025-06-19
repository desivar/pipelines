const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // If you have auth
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

router.route('/')
  .get(getJobs)
  .post(protect, createJob);

router.route('/:id')
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;