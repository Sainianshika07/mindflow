const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./middleware/loggerMiddleware');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const journalRoutes = require('./routes/journalRoutes');
const chatRoutes = require('./routes/chatRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: '*' })); // Enable CORS for development
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per window
  message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Logging
app.use(logger);

// Base Route
app.get('/', (req, res) => {
  res.json({ status: 'healthy', service: 'MindFlow API' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handler Middleware
app.use(errorHandler);

module.exports = app;

