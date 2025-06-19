const app = require('./app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

// MongoDB connection (modern syntax)
mongoose.connect('mongodb://localhost:27017/job-tracking')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if DB fails
  });
