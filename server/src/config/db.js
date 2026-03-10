import mongoose from 'mongoose';
import config from './config.js';

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.dbConnectionString);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

export default connectToDatabase;