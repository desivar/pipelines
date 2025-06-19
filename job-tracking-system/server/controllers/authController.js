const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// GitHub authentication callback
exports.githubAuthCallback = (req, res) => {
  passport.authenticate('github', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Authentication failed',
        user: user
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      return res.json({ user, token });
    });
  })(req, res);
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  res.json({ message: 'Logout successful' });
};