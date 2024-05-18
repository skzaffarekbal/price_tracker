// import mongoose from 'mongoose';

// let isConnected = false; // Variable to track connection status.

// export const connectToDB = async () => {
//   mongoose.set('strictQuery', true);
//   if (!process.env.MONGODB_URI) return console.log(`MONGODB_URI is not defined.`);

//   if (isConnected) return console.log(`=> Using existing database connection...`);

//   try {
//     await mongoose.connect(process.env.MONGODB_URI || '');
//     isConnected = true;
//     console.log('MongoDB Connected...');
//   } catch (error) {
//     console.log('🚀 ~ connectToDB ~ error:', error);
//   }
// };


// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 45000,          // Increased timeout
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    }).catch((error) => {
      console.error('Error connecting to MongoDB:', error.message);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;