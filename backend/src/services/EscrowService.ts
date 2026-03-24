import { EscrowTransaction, IEscrowTransaction } from '../models/EscrowTransaction';
import { Order, IOrder } from '../models/Order';

class EscrowService {
  // Create escrow transaction
  async createEscrowTransaction(orderId: string, amount: number): Promise<IEscrowTransaction | null> {
    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Create escrow transaction
    const escrowTransaction = await EscrowTransaction.create({
      orderId,
      amount: amount,
      status: 'HELD' // Changed from PENDING to HELD as per the new schema
    });

    // Update order status to PAID_IN_ESCROW
    await Order.findByIdAndUpdate(orderId, { status: 'PAID_IN_ESCROW' });

    return escrowTransaction;
  }

  // Hold funds in escrow
  async holdFunds(transactionId: string): Promise<IEscrowTransaction | null> {
    const transaction = await EscrowTransaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Escrow transaction not found');
    }

    // Update transaction status to HELD
    const updatedTransaction = await EscrowTransaction.findByIdAndUpdate(transactionId, { status: 'HELD' }, { new: true });

    return updatedTransaction;
  }

  // Release funds to vendor
  async releaseFunds(transactionId: string): Promise<IEscrowTransaction | null> {
    const transaction = await EscrowTransaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Escrow transaction not found');
    }

    // Update transaction status to RELEASED
    const updatedTransaction = await EscrowTransaction.findByIdAndUpdate(transactionId, { status: 'RELEASED' }, { new: true });

    // Update order status to COMPLETED
    const order = await Order.findById(transaction.orderId);
    if (order) {
      await Order.findByIdAndUpdate(order._id, { status: 'COMPLETED' });
    }

    return updatedTransaction;
  }

  // Refund funds to buyer
  async refundFunds(transactionId: string): Promise<IEscrowTransaction | null> {
    const transaction = await EscrowTransaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Escrow transaction not found');
    }

    // Update transaction status to REFUNDED
    const updatedTransaction = await EscrowTransaction.findByIdAndUpdate(transactionId, { status: 'REFUNDED' }, { new: true });

    // Update order status to CANCELLED
    const order = await Order.findById(transaction.orderId);
    if (order) {
      await Order.findByIdAndUpdate(order._id, { status: 'CANCELLED' });
    }

    return updatedTransaction;
  }

  // Get escrow transaction by ID
  async getEscrowTransactionById(id: string): Promise<IEscrowTransaction | null> {
    return await EscrowTransaction.findById(id);
  }

  // Get escrow transaction by order ID
  async getEscrowTransactionByOrderId(orderId: string): Promise<IEscrowTransaction | null> {
    return await EscrowTransaction.findOne({ orderId });
  }

  // Get escrow transactions by status
  async getEscrowTransactionsByStatus(status: IEscrowTransaction['status']): Promise<IEscrowTransaction[]> {
    return await EscrowTransaction.find({ status });
  }
}

export default new EscrowService();
