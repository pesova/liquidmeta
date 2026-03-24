import { Vendor, IVendor } from '../models/Vendor';
import { User } from '../models/User';

class VendorService {
  async createVendor(vendorData: Omit<IVendor, '_id' | 'createdAt' | 'updatedAt'>): Promise<IVendor> {
    const user = await User.findById(vendorData.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const existingVendor = await Vendor.findOne({ userId: vendorData.userId });
    if (existingVendor) {
      throw new Error('User already has a vendor account');
    }

    return await Vendor.create(vendorData);
  }

  async getVendorById(id: string): Promise<IVendor | null> {
    return await Vendor.findById(id);
  }

  async getVendorByUserId(userId: string): Promise<IVendor | null> {
    return await Vendor.findOne({ userId });
  }

  async updateVendor(id: string, vendorData: Partial<Omit<IVendor, '_id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<IVendor | null> {
    return await Vendor.findByIdAndUpdate(id, vendorData, { new: true });
  }

  async deleteVendor(id: string): Promise<boolean> {
    const result = await Vendor.findByIdAndDelete(id);
    return !!result;
  }
}

export default new VendorService();
