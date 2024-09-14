import mongoose from 'mongoose';

export async function connectToMongoDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017', {
      dbName: process.env.MONGODB_DB_NAME
    });
    console.log('MongoDB connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error);
    process.exit(1);
  }
}
