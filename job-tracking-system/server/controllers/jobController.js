const Job = require('../models/Job');
const Customer = require('../models/Customer');
const Pipeline = require('../models/Pipeline');
const User = require('../models/User');

// @desc    Get all jobs with populated references
// @route   GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('customer', 'name email')
      .populate('pipeline', 'name')
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    // Verify references exist
    const [customer, pipeline, user] = await Promise.all([
      Customer.findById(req.body.customer),
      Pipeline.findById(req.body.pipeline),
      User.findById(req.body.createdBy)
    ]);

    if (!customer || !pipeline || !user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid customer, pipeline, or user reference'
      });
    }

    const job = await Job.create(req.body);
    
    // Populate references in the response
    const populatedJob = await Job.findById(job._id)
      .populate('customer', 'name email')
      .populate('pipeline', 'name')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedJob
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error: ' + err.message
      });
    }
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Verify references if they're being updated
    if (req.body.customer) {
      const customer = await Customer.findById(req.body.customer);
      if (!customer) {
        return res.status(400).json({
          success: false,
          error: 'Invalid customer reference'
        });
      }
    }

    if (req.body.pipeline) {
      const pipeline = await Pipeline.findById(req.body.pipeline);
      if (!pipeline) {
        return res.status(400).json({
          success: false,
          error: 'Invalid pipeline reference'
        });
      }
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('customer pipeline createdBy');

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error: ' + err.message
      });
    }
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    await job.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: ' + err.message
    });
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob
};