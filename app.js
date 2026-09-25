const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');
const assistantRoutes = require('./routes/assistant');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { auth } = require('./middleware/auth');

// Builds the Express app without connecting to MongoDB or listening, so it can
// be shared by the long-running server (server.js) and serverless entry (api/index.js).
const createApp = ({ corsOrigin = '*', trustProxy = false } = {}) => {
  const app = express();

  if (trustProxy) app.set('trust proxy', trustProxy);

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', auth, cartRoutes);
  app.use('/api/orders', auth, orderRoutes);
  app.use('/api/user', auth, userRoutes);
  app.use('/api/assistant', assistantRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running', timestamp: new Date().toISOString() });
  });

  // Error handling middleware
  app.use(errorHandler);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  return app;
};

module.exports = createApp;
