import EscrowService from '../services/EscrowService';
import { EscrowTransaction } from '../models/EscrowTransaction';
import { User } from '../models/User';
import { Order } from '../models/Order';

class AdminService {
  async getAllEscrows() {
    return EscrowTransaction.find()
      .populate('order', '_id')
      .populate('buyer', 'email')
      .populate('vendor', 'email');
  }

  async getVendorBalances(vendorId: string) {
    const holding = await EscrowService.getVendorEscrowBalance(vendorId);
    const available = await EscrowService.getVendorAvailableBalance(vendorId);
    return { vendorId, holdingBalance: holding, availableBalance: available };
  }

  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find()
        .populate('roleId')
        .skip(skip)
        .limit(limit)
        .select('-password'),
      User.countDocuments(),
    ]);
    return { users, total, page, limit };
  }

  async getAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find()
        .populate('buyer', 'email')
        .populate('vendor', 'email')
        .populate('product', 'name')
        .skip(skip)
        .limit(limit),
      Order.countDocuments(),
    ]);
    return { orders, total, page, limit };
  }

  // Resolve dispute
  async resolveDispute(orderId: string, action: string) {
    if (action === 'release') {
      await EscrowService.releaseForOrder(orderId);
    } else if (action === 'refund') {
      await EscrowService.refundForOrder(orderId);
    } else {
      throw new Error("action must be 'release' or 'refund'");
    }
  }
}

export default new AdminService();
