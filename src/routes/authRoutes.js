// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration Route
router.post('/register', async (req, res) => {
  try {
    await authController.register(req, res);
  } catch (err) {
    console.error('Error in /register route:', err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    await authController.login(req, res);
  } catch (err) {
    console.error('Error in /login route:', err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Logout Route
router.post('/logout', async (req, res) => {
  try {
    await authController.logout(req, res);
  } catch (err) {
    console.error('Error in /logout route:', err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Update user profile
router.put('/profile', requireAuth, userController.updateProfile);

module.exports = router;
