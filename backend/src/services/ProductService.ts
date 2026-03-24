import { Product, IProduct } from '../models/Product';
import { Vendor } from '../models/Vendor';

class ProductService {
  async createProduct(productData: Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
    const vendor = await Vendor.findById(productData.vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    return await Product.create(productData);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  async getProductsByVendorId(vendorId: string): Promise<IProduct[]> {
    return await Product.find({ vendorId });
  }

  async searchProducts(filters: {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    vendorId?: string;
  }): Promise<IProduct[]> {
    const query: any = {};
    
    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }
    
    if (filters.minPrice !== undefined) {
      query.price = { ...query.price, $gte: filters.minPrice };
    }
    
    if (filters.maxPrice !== undefined) {
      query.price = { ...query.price, $lte: filters.maxPrice };
    }
    
    if (filters.vendorId) {
      query.vendorId = filters.vendorId;
    }

    return await Product.find(query);
  }

  async updateProduct(id: string, productData: Partial<Omit<IProduct, '_id' | 'vendorId' | 'createdAt' | 'updatedAt'>>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async updateProductQuantity(id: string, quantity: number): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, { quantity }, { new: true });
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }
}

export default new ProductService();
