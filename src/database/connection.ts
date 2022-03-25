import mongoose from 'mongoose';
const { MONGODB_URI } = process.env;

if (typeof MONGODB_URI === 'undefined') {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    if (cached.conn !== null) {
      return cached.conn;
    }

    if (typeof MONGODB_URI === 'undefined') {
      throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local',
      );
    }

    if (cached.promise == null) {
      const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        bufferMaxEntries: 0,
        useFindAndModify: false,
        useCreateIndex: true,
      };

      cached.promise = mongoose
        .connect(MONGODB_URI, opts)
        .then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    console.log(err);
    console.log(`\n\n\nDB CONNECTION FAILED\n\n\n`);
  }
}

export default dbConnect;
