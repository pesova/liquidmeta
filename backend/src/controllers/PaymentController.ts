import { Request, Response } from 'express';
import PaymentService from '../services/PaymentService';
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
    throw error
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    // Interswitch redirects buyer to your redirectUrl with txnref as a query param.
    // They may also POST with it in the body — handle both.
    const interswitchRef =
      req.query.txnref        ||
      req.query.transactionRef ||
      req.body.txnref          ||
      req.body.transactionRef;

    if (!interswitchRef) {
      return res.status(400).json({ success: false, message: 'txnref is required' });
    }

    const result = await PaymentService.processWebhook(interswitchRef as string);

    // Always return 200 — Interswitch retries on non-200 responses
    res.status(200).json({ success: result.success, data: result });
  } catch (error: any) {
    throw error
  }
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
    throw error
  }
};