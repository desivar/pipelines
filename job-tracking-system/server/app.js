const express = require('express');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');
require('dotenv').config();
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
// ... other middleware ...
app.use('/api/auth', authRoutes);

// Connect to database
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api/jobs', jobRoutes);

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/pipelines', require('./routes/pipelineRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;