import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'AI MarketLink API is running!' });
});

app.get('/api/test', (req: Request, res: Response) => {
  res.json({ 
    message: 'Hello from TypeScript backend!',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});