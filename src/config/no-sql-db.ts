import { MongooseModelMap } from '@/types/constants/mongoose-model-map.constant';
import mongoose from 'mongoose';

export async function connectToMongoDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017', {
      dbName: process.env.MONGODB_DB_NAME
    });

    await assertAllModelsExist();

    console.log('MongoDB connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error);
    process.exit(1);
  }
}
async function assertAllModelsExist() {
  await Promise.all(Object.values(MongooseModelMap).map((model) => model.init()));
}
