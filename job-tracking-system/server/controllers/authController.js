const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 1. Login (Creates/Fetches a real user)
exports.login = async (req, res) => {
  try {
    // Check if test user exists
    let user = await User.findOne({ email: "test@example.com" });
    
    // Create if missing (for homework demo)
    if (!user) {
      user = await User.create({
        name: "Test User",
        email: "test@example.com",
        githubId: "12345",
        avatar: "https://example.com/avatar.jpg"
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, 'homework-secret-key');
    
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get current user (Real DB query)
exports.getUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'homework-secret-key');
    const user = await User.findById(decoded.id);
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};