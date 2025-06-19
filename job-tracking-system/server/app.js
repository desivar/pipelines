const express = require('express');
const app = express();

// Middleware (parse JSON requests)
app.use(express.json());


// server/app.js
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' http://localhost:5500 https://github.com;"
  );
  next();
});
// Test route
app.get('/', (req, res) => {
  res.send('Job Tracking API is running! 🚀');
});

// Export the Express app
module.exports = app;