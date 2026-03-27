import express, { Request, Response } from 'express';
import env from './config/env';
import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import vendorRoutes from './routes/vendor';
import { errorHandler } from './utils/errorHandler';
import productRoutes from './routes/product';
import chatRoutes from './routes/chat';
import orderRoutes from './routes/order';
import paymentRoutes from './routes/payment';
import adminRoutes from './routes/admin';

connectDB();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

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

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

app.use(errorHandler)

export default app;