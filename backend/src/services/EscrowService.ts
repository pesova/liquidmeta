import { Types } from 'mongoose';
import { EscrowTransaction, EscrowStatus } from '../models/EscrowTransaction';
import { Order, OrderStatus } from '../models/Order';

/**
 * EscrowService
 *
 * Owns all escrow state transitions.
 * Called by PaymentService (on webhook) and OrderService (on delivery confirm / cancel).
 *
 * Escrow lifecycle:
 *   createForOrder()   — called after Interswitch confirms payment — status: HOLDING
 *   releaseForOrder()  — called after buyer confirms delivery     — status: RELEASED
 *   refundForOrder()   — called when order is cancelled from escrow — status: REFUNDED
 */
class EscrowService {
  /**
   * Lock funds in escrow after successful payment.
   * Creates an EscrowTransaction and moves the Order to PAID_IN_ESCROW.
   */
  public async createForOrder(params: {
    orderId: string;
    buyerId: string;
    vendorId: string;
    amount: number;
    interswitchRef: string;
    interswitchPaymentId?: string;
  }): Promise<void> {
    const { orderId, buyerId, vendorId, amount, interswitchRef, interswitchPaymentId } = params;

    // Guard: don't double-create escrow for the same transaction ref
    const existing = await EscrowTransaction.findOne({ interswitchRef });
    if (existing) {
      console.log(`EscrowService: escrow already exists for ref ${interswitchRef} — skipping`);
      return;
    }

    await EscrowTransaction.create({
      order: new Types.ObjectId(orderId),
      buyer: new Types.ObjectId(buyerId),
      vendor: new Types.ObjectId(vendorId),
      amount,
      status: EscrowStatus.HOLDING,
      interswitchRef,
      interswitchPaymentId,
    });

    // Move order to PAID_IN_ESCROW
    await Order.findByIdAndUpdate(orderId, {
      status: OrderStatus.PAID_IN_ESCROW,
    });

    console.log(`EscrowService: funds locked for order ${orderId} — ₦${amount / 100}`);

  }
  /**
   * Initiate an escrow record when payment link is created.
   * Sets status to INITIATED and stores the Interswitch reference.
   */
  public async initiateEscrow(params: {
    orderId: string;
    buyerId: string;
    vendorId: string;
    amount: number;
    interswitchRef: string;
  }): Promise<void> {
    const { orderId, buyerId, vendorId, amount, interswitchRef } = params;
    const existing = await EscrowTransaction.findOne({ interswitchRef });
    if (existing) {
      console.log(`EscrowService: escrow already exists for ref ${interswitchRef} — skipping init`);
      return;
    }
    await EscrowTransaction.create({
      order: new Types.ObjectId(orderId),
      buyer: new Types.ObjectId(buyerId),
      vendor: new Types.ObjectId(vendorId),
      amount,
      status: EscrowStatus.INITIATED,
      interswitchRef,
    });
    console.log(`EscrowService: initiated escrow for order ${orderId}`);
  }

  /**
   * Finalize escrow after successful payment verification.
   * Moves escrow from INITIATED to HOLDING and updates order status.
   */
  public async finalizeEscrow(orderId: string, interswitchPaymentId?: string): Promise<void> {
    const escrow = await EscrowTransaction.findOne({
      order: new Types.ObjectId(orderId),
      status: EscrowStatus.INITIATED,
    });
    if (!escrow) {
      throw new Error(`No initiated escrow found for order ${orderId}`);
    }
    escrow.status = EscrowStatus.HOLDING;
    if (interswitchPaymentId) escrow.interswitchPaymentId = interswitchPaymentId;
    await escrow.save();
    await Order.findByIdAndUpdate(orderId, { status: OrderStatus.PAID_IN_ESCROW });
    console.log(`EscrowService: escrow finalized and funds locked for order ${orderId}`);
  }

  /**
   * Release funds to vendor after buyer confirms delivery.
   * Moves escrow to RELEASED and order to COMPLETED.
   *
   * NOTE: In a real system this would trigger a bank transfer to the vendor's
   * settlement account. For MVP, "release" means marking the record — your
   * finance/admin layer handles the actual payout run.
   */
  public async releaseForOrder(orderId: string): Promise<void> {
    const escrow = await EscrowTransaction.findOne({
      orderId: new Types.ObjectId(orderId),
      status: EscrowStatus.HOLDING,
    });

    if (!escrow) {
      throw new Error(`No active escrow found for order ${orderId}`);
    }

    escrow.status = EscrowStatus.RELEASED;
    escrow.releasedAt = new Date();
    await escrow.save();

    await Order.findByIdAndUpdate(orderId, {
      status: OrderStatus.COMPLETED,
      completedAt: new Date(),
    });

    console.log(`EscrowService: funds released for order ${orderId}`);
  }

  /**
   * Refund buyer when order is cancelled from PAID_IN_ESCROW.
   * Moves escrow to REFUNDED.
   *
   * NOTE: Same as release — the actual Interswitch refund API call should be
   * wired here once you have settlement credentials. For MVP, mark the record.
   */
  public async refundForOrder(orderId: string): Promise<void> {
    const escrow = await EscrowTransaction.findOne({
      orderId: new Types.ObjectId(orderId),
      status: EscrowStatus.HOLDING,
    });

    if (!escrow) {
      throw new Error(`No active escrow found for order ${orderId}`);
    }

    escrow.status = EscrowStatus.REFUNDED;
    escrow.refundedAt = new Date();
    await escrow.save();

    console.log(`EscrowService: funds marked for refund on order ${orderId}`);
  }

  /**
   * Get escrow record for an order (for admin / vendor balance views).
   */
  public async getByOrderId(orderId: string) {
    return EscrowTransaction.findOne({ orderId: new Types.ObjectId(orderId) });
  }

  /**
   * Get total funds currently held in escrow for a vendor.
   * Used by the vendor balance endpoint.
   */
  public async getVendorEscrowBalance(vendorId: string): Promise<number> {
    const result = await EscrowTransaction.aggregate([
      {
        $match: {
          vendorId: new Types.ObjectId(vendorId),
          status: EscrowStatus.HOLDING,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Amount stored in kobo — return in naira
    return result.length > 0 ? result[0].total / 100 : 0;
  }

  /**
   * Get total released (available) funds for a vendor.
   * "Available" = released funds not yet paid out to vendor's bank.
   */
  public async getVendorAvailableBalance(vendorId: string): Promise<number> {
    const result = await EscrowTransaction.aggregate([
      {
        $match: {
          vendorId: new Types.ObjectId(vendorId),
          status: EscrowStatus.RELEASED,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result.length > 0 ? result[0].total / 100 : 0;
  }
}

export default new EscrowService();
