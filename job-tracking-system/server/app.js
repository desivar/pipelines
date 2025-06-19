const express = require('express');
const cors = require('cors'); // Add this line
const app = express();

// Enable CORS (place this ABOVE all other middleware)
app.use(cors({
  origin: 'http://localhost:3000', // Your React frontend URL
  credentials: true, // Required for cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Allowed HTTP methods
}));

// Middleware (parse JSON requests)
app.use(express.json());

// Security headers (optional, but keep it after CORS)
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

module.exports = app;