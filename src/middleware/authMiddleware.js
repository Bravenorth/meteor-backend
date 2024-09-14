// src/middleware/authMiddleware.js
const User = require('../models/User');

exports.requireAuth = async (req, res, next) => {
  try {
    // Check if the user_id cookie is present
    const uuid = req.cookies.user_id;
    if (!uuid) {
      return res.status(401).json({ error: 'User not authenticated. Please log in.' });
    }

    // Find the user by UUID
    const user = await User.findOne({ uuid });
    if (!user) {
      return res.status(401).json({ error: 'User not found or session expired. Please log in again.' });
    }

    // Attach user object to the request for use in subsequent middleware or routes
    req.user = user;
    next();
  } catch (err) {
    // Log the error (optional) and send a more general error response
    console.error('Authentication Error:', err);
    res.status(500).json({ error: 'Internal server error while authenticating. Please try again later.' });
  }
};
