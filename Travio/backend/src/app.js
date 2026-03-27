const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const path         = require('path');
const rateLimit    = require('express-rate-limit');
require('dotenv').config();

const authRoutes   = require('./routes/auth.routes');
const blogRoutes   = require('./routes/blog.routes');
const uploadRoutes = require('./routes/upload.routes');
const contactRoutes = require('./routes/contact.routes');
const { errorHandler } = require('./middleware/error.middleware');
const { errorResponse } = require('./utils/response.util');

const app = express();

// Required when running behind reverse proxies/tunnels (e.g. ngrok)
app.set('trust proxy', 1);

// -------------------------------------------------------------------
// Security headers
// -------------------------------------------------------------------
app.use(
  helmet({
    // Needed so images from http://localhost:5000/uploads can be shown in
    // frontend running on a different origin (e.g. http://localhost:5173).
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);

// -------------------------------------------------------------------
// CORS — allow the React frontend origin
// -------------------------------------------------------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// -------------------------------------------------------------------
// Rate limiter — protect API from abuse
// -------------------------------------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse('Too many requests. Please try again later.'),
});
app.use('/api', limiter);

// -------------------------------------------------------------------
// Request parsing
// -------------------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// -------------------------------------------------------------------
// HTTP request logger (dev only)
// -------------------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// -------------------------------------------------------------------
// Static files — serve uploaded images
// -------------------------------------------------------------------
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'), {
    maxAge: '7d',
  })
);

// -------------------------------------------------------------------
// API Routes
// -------------------------------------------------------------------
app.use('/api/auth',   authRoutes);
app.use('/api/blog',   blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

// Health-check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json(errorResponse('Route not found'));
});

// -------------------------------------------------------------------
// Global error handler (must be last)
// -------------------------------------------------------------------
app.use(errorHandler);

module.exports = app;
