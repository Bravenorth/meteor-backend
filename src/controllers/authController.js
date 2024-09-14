// src/controllers/authController.js
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email or username is already taken
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({ error: `${field} is already in use` });
    }

    // Create a new user
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    // Check for Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ error: `Validation error: ${errors.join(', ')}` });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Both email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Set cookie
    res.cookie('user_id', user.uuid, { httpOnly: true, secure: true });
    res.status(200).json({ message: 'Logged in successfully' });

  } catch (err) {
    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  try {
    // Check if user is already logged in
    if (!req.cookies.user_id) {
      return res.status(400).json({ error: 'No active session to logout' });
    }

    // Clear cookie
    res.clearCookie('user_id');
    res.status(200).json({ message: 'Logged out successfully' });

  } catch (err) {
    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user is set by requireAuth middleware
    const updates = req.body;

    // Validate updates
    const allowedUpdates = ['firstName', 'lastName', 'bio', 'profilePicture'];
    const updateKeys = Object.keys(updates);
    const isValidOperation = updateKeys.every(key => allowedUpdates.includes(key));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    // Find user and update
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    updateKeys.forEach(key => {
      user[key] = updates[key];
    });

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user: user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};