const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// @route   GET /auth/github
// @desc    Authenticate with GitHub
// @access  Public
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// @route   GET /auth/github/callback
// @desc    GitHub authentication callback
// @access  Public
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  authController.githubAuthCallback
);

// @route   GET /auth/user
// @desc    Get current user
// @access  Private
router.get('/user', passport.authenticate('jwt', { session: false }), authController.getCurrentUser);

// @route   POST /auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', passport.authenticate('jwt', { session: false }), authController.logoutUser);

module.exports = router;