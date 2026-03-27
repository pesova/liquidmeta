import express, { Router } from 'express';
import { handleRawWebhook } from '../controllers/RawWebhookController';

const router = Router();

// Interswitch expects raw JSON payloads. Use express.raw middleware when mounting.
// router.post('/webhook/raw', express.raw({ type: 'application/json' }), handleRawWebhook);
router.post('/webhook/raw', handleRawWebhook);

export default router;
