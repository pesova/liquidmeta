import { Router } from 'express';
import { mockTransaction } from '../controllers/MockInterswitchController';

const router = Router();

// Simple mock endpoint – no auth required for testing
router.post('/mock/transaction', mockTransaction);

export default router;
