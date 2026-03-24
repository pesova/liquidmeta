import express, { Request, Response } from 'express';
import env from './config/env';
import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/auth';

connectDB();

const app = express();

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

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

app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global error handler:", err.message);

  if (err.message === "Invalid webhook signature") {
    return res.sendStatus(401);
  }

  if (err.message === "Missing signature header") {
    return res.sendStatus(400);
  }

  res.status(500).json({
    error: "Internal Server Error"
  });
});

export default app;