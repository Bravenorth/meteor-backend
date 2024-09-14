// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// User Schema
const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username must not exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email address format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  // New fields for user profile personalization
  firstName: {
    type: String,
    maxlength: [50, 'First name must not exceed 50 characters']
  },
  lastName: {
    type: String,
    maxlength: [50, 'Last name must not exceed 50 characters']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio must not exceed 500 characters']
  },
  profilePicture: {
    type: String, // URL to the profile picture
    match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/, 'Invalid URL format for profile picture']
  },
  // Add any other fields you want
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error('Error comparing passwords');
  }
};

// Export the User model
module.exports = mongoose.model('User', userSchema);
