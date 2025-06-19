const express = require('express');
const app = express();

// Middleware (parse JSON requests)
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Job Tracking API is running! 🚀');
});

// Export the Express app
module.exports = app;