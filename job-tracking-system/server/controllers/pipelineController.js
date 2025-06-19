const Pipeline = require('../models/Pipeline');

// Get all pipelines
exports.getPipelines = async (req, res) => {
  try {
    const pipelines = await Pipeline.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(pipelines);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a pipeline
exports.createPipeline = async (req, res) => {
  const { name, description, steps } = req.body;

  try {
    const newPipeline = new Pipeline({
      name,
      description,
      steps,
      createdBy: req.user.id
    });

    const pipeline = await newPipeline.save();
    res.json(pipeline);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a pipeline
exports.updatePipeline = async (req, res) => {
  const { name, description, steps } = req.body;

  try {
    let pipeline = await Pipeline.findById(req.params.id);

    if (!pipeline) {
      return res.status(404).json({ msg: 'Pipeline not found' });
    }

    // Check user owns the pipeline
    if (pipeline.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    pipeline = await Pipeline.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, steps } },
      { new: true }
    );

    res.json(pipeline);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a pipeline
exports.deletePipeline = async (req, res) => {
  try {
    const pipeline = await Pipeline.findById(req.params.id);

    if (!pipeline) {
      return res.status(404).json({ msg: 'Pipeline not found' });
    }

    // Check user owns the pipeline
    if (pipeline.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Pipeline.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Pipeline removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};