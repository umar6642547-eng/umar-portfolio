import mongoose from 'mongoose';

// Cache the connection on globalThis so serverless invocations reuse it.
const cache = (globalThis.__mongoCache ||= { conn: null, promise: null });

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (cache.conn) return cache.conn;
  try {
    cache.promise ||= mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    cache.conn = await cache.promise;
    return cache.conn;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
}
