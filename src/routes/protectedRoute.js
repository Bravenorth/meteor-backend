// src/routes/protectedRoute.js
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');

// Dashboard route
router.get('/dashboard', requireAuth, (req, res) => {
  try {
    // Respond with a personalized welcome message
    res.status(200).json({ message: `Welcome ${req.user.username}` });
  } catch (err) {
    // Log the error for debugging
    console.error('Error on /dashboard route:', err);
    
    // Respond with a generic error message
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Add more protected routes here in the future

module.exports = router;
