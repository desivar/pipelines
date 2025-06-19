const express = require('express');
const router = express.Router();
const { login, getUser } = require('../controllers/authController');

// Simple endpoints
router.get('/login', login);      // GET /api/auth/login
router.get('/user', getUser);     // GET /api/auth/user

module.exports = router;

// @route   GET /auth/github
