import express, { Request, Response } from 'express';
import env from './config/env';
import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import vendorRoutes from './routes/vendor';
import { errorHandler } from './utils/errorHandler';
import productRoutes from './routes/product';

connectDB();

const app = express();

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'AI MarketLink API is running!' });
});


// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler)

export default app;