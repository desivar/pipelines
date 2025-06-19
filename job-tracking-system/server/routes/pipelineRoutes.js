const express = require('express');
const router = express.Router();
const pipelineController = require('../controllers/pipelineController');

// @route   GET /api/pipelines
// @desc    Get all pipelines
router.get('/', pipelineController.getPipelines);

// @route   POST /api/pipelines
// @desc    Create a pipeline
router.post('/', pipelineController.createPipeline);

// @route   PUT /api/pipelines/:id
// @desc    Update a pipeline
router.put('/:id', pipelineController.updatePipeline);

// @route   DELETE /api/pipelines/:id
// @desc    Delete a pipeline
router.delete('/:id', pipelineController.deletePipeline);

module.exports = router;