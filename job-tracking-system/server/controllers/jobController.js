const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add other controller methods (createJob, updateJob, deleteJob) here...

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob
};