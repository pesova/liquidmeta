import { Router } from 'express';
import { initiatePayment, handleWebhook, handleWebhookPost, getEscrowByOrder, checkTransactionStatus } from '../controllers/PaymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Interswitch POSTs here after payment + buyer is redirected here after checkout
router.post('/webhook', handleWebhookPost);
router.get('/webhook', handleWebhook);

router.use(authenticateToken);

router.post('/initiate', initiatePayment);
router.get('/escrow/:orderId', getEscrowByOrder);
router.get('/status', checkTransactionStatus);

export default router;
