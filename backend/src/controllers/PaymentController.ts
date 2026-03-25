import { Request, Response } from 'express';
import PaymentService from '../services/PaymentService';
import InterswitchProvider from '../services/api/InterswitchProvider';
import EscrowService from '../services/EscrowService';

/**
 * POST /api/payments/initiate
 * Buyer calls this to get an Interswitch checkout URL for their order.
 *
 * Body: { orderId: string }
 */
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const user = (req as any).user;

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    const result = await PaymentService.initiatePayment(
      orderId,
      user._id.toString(),
      user.email
    );

    res.status(200).json({
      success: true,
      message: 'Payment link created. Redirect buyer to paymentUrl to complete payment.',
      data: result,
    });
  } catch (error: any) {
    throw error;
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    // Interswitch redirects buyer to your redirectUrl with txnref as a query param.
    // They may also POST with it in the body — handle both.
    console.log('handleWebhook');
    
    const interswitchRef =
      (req.query.txnref as string) ||
      (req.query.transactionRef as string) ||
      (req.body.txnref as string) ||
      (req.body.transactionRef as string);

    if (!interswitchRef) {
      return res.status(400).json({ success: false, message: 'txnref is required' });
    }

    const result = await PaymentService.processWebhook(interswitchRef);

    // Always return 200 — Interswitch retries on non-200 responses
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Webhook handling error:', error);
    // Respond with 200 to avoid retries, but indicate failure in logs
    return res.status(200).json({ success: false, message: error.message || 'Webhook processing error' });
  }
};

export const handleWebhookPost = async (req: Request, res: Response) => {
  // Reuse the same logic as GET webhook handler
   console.log('handleWebhookPost');
  return handleWebhook(req, res);
};

/**
 * GET /api/payments/escrow/:orderId
 * Get the escrow record for a specific order.
 * Buyer or vendor can call this to see escrow status.
 */
export const getEscrowByOrder = async (req: Request, res: Response) => {
  try {
    const escrow = await EscrowService.getByOrderId(req.params.orderId as string);

    if (!escrow) {
      return res.status(404).json({ success: false, message: 'No escrow record found for this order' });
    }

    res.status(200).json({
      success: true,
      data: escrow,
    });
  } catch (error: any) {
    throw error;
  }
};

/**
 * GET /api/payments/status?reference=...&amount=...
 * Manually check transaction status.
 */
export const checkTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { reference } = req.query;
    if (!reference) {
      return res.status(400).json({ success: false, message: 'reference is required' });
    }
    const escrowRecord = await (await import('../models/EscrowTransaction')).EscrowTransaction.findOne({ interswitchRef: reference as string });
    if (!escrowRecord) {
      return res.status(404).json({ success: false, message: 'Escrow not found for given reference' });
    }
    const amountKobo = escrowRecord.amount;
    const result = await InterswitchProvider.verifyTransaction(reference as string, amountKobo);
    if (result.responseCode === '00') {
      // Successful payment – finalize escrow
      await EscrowService.finalizeEscrow(escrowRecord.order.toString(), result.paymentReference);
    }
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('checkTransactionStatus error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};