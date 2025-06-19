const express = require('express');
const router = express.Router();
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

// Include auth middleware if needed
// const { protect } = require('../middlewares/auth');

router.route('/')
  .get(getJobs)
  .post(createJob); // Add protect middleware if needed: .post(protect, createJob)

router.route('/:id')
  .put(updateJob)   // Add protect middleware if needed: .put(protect, updateJob)
  .delete(deleteJob); // Add protect middleware if needed: .delete(protect, deleteJob)

module.exports = router;