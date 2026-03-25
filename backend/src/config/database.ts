import mongoose from 'mongoose';
import env from './env';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;