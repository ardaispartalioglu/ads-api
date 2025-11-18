// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import routes
const tiktokRoutes = require('./routes/tiktok');
const metaRoutes = require('./routes/meta');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Ads API is running 🚀',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/tiktok', tiktokRoutes);
app.use('/meta', metaRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ads API server is running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🎵 TikTok Ads: POST http://localhost:${PORT}/tiktok/ads`);
  console.log(`📘 Meta Ads: POST http://localhost:${PORT}/meta/ads`);
});
