const app = require('./app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

// Database connection
mongoose.connect('mongodb://localhost:27017/job-tracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  // Start server only after DB connection
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));