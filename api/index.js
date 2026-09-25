// Serverless entry point (Vercel Functions). The MongoDB connection is cached on
// the module scope so warm invocations reuse it instead of reconnecting.
const mongoose = require('mongoose');
const createApp = require('../app');

const corsOrigin = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((o) => o.trim()).filter(Boolean)
  : '*';

const app = createApp({ corsOrigin, trustProxy: 1 });

let cached = global._mongooseConnection;
if (!cached) cached = global._mongooseConnection = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  if (!cached.promise) {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 10000 })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ message: 'Database unavailable' }));
  }
  return app(req, res);
};
