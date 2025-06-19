const express = require('express');
const router = express.Router();
const passport = require('passport');
const pipelineController = require('../controllers/pipelineController');

// @route   GET /api/pipelines
// @desc    Get all pipelines
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  pipelineController.getPipelines
);

// @route   POST /api/pipelines
// @desc    Create a pipeline
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  pipelineController.createPipeline
);

// @route   PUT /api/pipelines/:id
// @desc    Update a pipeline
// @access  Private
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  pipelineController.updatePipeline
);

// @route   DELETE /api/pipelines/:id
// @desc    Delete a pipeline
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  pipelineController.deletePipeline
);

module.exports = router;