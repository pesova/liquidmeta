import { User } from '../models/User';
import { ClientSession } from 'mongoose';

import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { EscrowTransaction } from '../models/EscrowTransaction';
import NotificationService from './NotificationService';
import { NotificationCategoryEnum } from '../interfaces/INotification';
import { EmailTemplateEnum } from './SmtpProvider';
import { IVendor, Vendor } from '../models';

class VendorService {

  async getVendorById(id: string): Promise<IVendor | null> {
    return await Vendor.findById(id);
  }

  async getVendorByUserId(userId: string): Promise<IVendor | null> {
    return await Vendor.findOne({ user: userId });
  }

  async updateVendor(id: string, vendorData: Partial<Omit<IVendor, '_id' | 'user' | 'createdAt' | 'updatedAt'>>): Promise<IVendor | null> {
    return await Vendor.findByIdAndUpdate(id, vendorData, { new: true });
  }

  async deleteVendor(id: string): Promise<boolean> {
    const result = await Vendor.findByIdAndDelete(id);
    return !!result;
  }

  // Onboard a user as vendor (creates profile and sends email)
async onboard(
  userId: string,
  data: {
    firstName: string;
    lastName: string;
    businessName: string;
    nin: string;
    ninData?: Record<any, any>;
    phoneNumber: string;
  },
  session: ClientSession
): Promise<any> {
  const existing = await Vendor.findOne({ user: userId }).session(session);
  if (existing) throw new Error('Vendor profile already exists for this account');

  const [vendor] = await Vendor.create([{
    user: userId,
    firstName: data.firstName,
    lastName: data.lastName,
    businessName: data.businessName,
    nin: data.nin,
    ninData: data.ninData,
    phoneNumber: data.phoneNumber
  }], { session });

  const user = await User.findById(userId);
  if (user) {
    NotificationService
      .setTo({ userId: user._id, email: user.email })
      .setSubject('Vendor Onboarding Successful')
      .setCategory(NotificationCategoryEnum.GENERAL)
      .useTemplate(EmailTemplateEnum.VENDOR_ONBOARD, {
        name: user.name,
        businessName: data.businessName
      })
      .sendViaEmail()
      .catch((err) => console.error('Vendor onboarding email failed:', err));
  }

  return vendor;
}

  async getProfile(userId: string) {
    return Vendor.findOne({ user: userId }).populate('user');
  }

  async updateProfile(userId: string, data: { businessName?: string; phoneNumber?: string }) {
    return Vendor.findOneAndUpdate({ user: userId }, { $set: data }, { new: true });
  }

  async getProducts(vendorId: string) {
    return Product.find({ vendorId });
  }

  async getOrders(vendorId: string) {
    return Order.find({ vendorId });
  }

  async getBalance(vendorId: string) {
    const orders = await Order.find({ vendorId }).select('_id');
    const orderIds = orders.map((o) => o._id);
    const agg = await EscrowTransaction.aggregate([
      { $match: { orderId: { $in: orderIds } } },
      { $group: { _id: '$status', total: { $sum: '$amount' } } }
    ]);
    let escrow = 0;
    let available = 0;
    for (const g of agg) {
      if (g._id === 'HELD') escrow = g.total;
      if (g._id === 'RELEASED') available = g.total;
    }
    return { escrow, available };
  }

  async getPublicProfile(vendorId: string) {
    return Vendor.findById(vendorId).populate('user', 'name');
  }
}

export default new VendorService();
