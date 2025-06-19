const Job = require('../models/Job');

const getJobs = async (req, res) => {
  try {
    // Only get jobs for the authenticated user
    const jobs = await Job.find({ user: req.user });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createJob = async (req, res) => {
  try {
    // Add user to job data
    const jobData = {
      ...req.body,
      user: req.user // Add the authenticated user's ID
    };
    
    const job = new Job(jobData);
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getJobs,
  createJob
  // Add other controller methods as needed
};