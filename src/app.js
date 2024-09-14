// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const protectedRoute = require('./routes/protectedRoute');

const app = express();

// Security Middleware
app.use(helmet());

// Configure CORS based on environment
const isDevelopment = process.env.NODE_ENV !== 'production'; // Check if not in production mode
const corsOptions = {
  origin: isDevelopment ? 'http://localhost:3000' : 'http://your-frontend-domain.com', // Use localhost in development
  credentials: true
};
app.use(cors(corsOptions));

// Parsing Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal server error. Please try again later.' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${isDevelopment ? 'development' : 'production'} mode.`);
});
