// server/routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

// GitHub Auth Route
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub Callback Route
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    const token = generateToken(req.user); // Your JWT function
    res.redirect(`http://localhost:5501/auth-success?token=${token}`);
  }
);

module.exports = router;