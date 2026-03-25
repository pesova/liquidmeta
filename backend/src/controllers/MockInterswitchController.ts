import { Request, Response } from 'express';
import EscrowService from '../services/EscrowService';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Vendor } from '../models/Vendor';

export const mockTransaction = async (req: Request, res: Response) => {
  try {
    const { orderId, buyerId, vendorId, amount, interswitchRef } = req.body as {
      orderId: string;
      buyerId: string;
      vendorId: string;
      amount: number;
      interswitchRef: string;
    };

    if (!orderId || !buyerId || !vendorId || !amount || !interswitchRef) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Ensure order exists (optional, but good sanity check)
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure buyer and vendor exist (optional)
    await User.findById(buyerId);
    await Vendor.findById(vendorId);

    await EscrowService.createForOrder({
      orderId,
      buyerId,
      vendorId,
      amount,
      interswitchRef,
    });

    res.status(200).json({ success: true, message: 'Mock transaction processed' });
  } catch (error: any) {
    console.error('Mock transaction error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal error' });
  }
};
