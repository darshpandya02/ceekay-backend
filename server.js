const mongoose = require('mongoose');
require('dotenv').config();

const createApp = require('./app');

const app = createApp({
  // origin: process.env.FRONTEND_URL || '*',
  corsOrigin: "*",
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ceekay-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
