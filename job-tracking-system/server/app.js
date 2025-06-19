const express = require('express');
const app = express();
const jobRoutes = require('./routes/jobRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;