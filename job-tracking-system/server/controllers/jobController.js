// controllers/jobController.js
const Job = require('../models/Job');

// @desc    Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a job
const createJob = async (req, res) => {
  const job = new Job(req.body);
  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Make sure all functions are properly exported
module.exports = {
  getJobs,
  createJob
};