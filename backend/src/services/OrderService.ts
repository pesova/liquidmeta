import { Order, IOrder } from '../models/Order';
import { Product } from '../models/Product';
import { Vendor } from '../models/Vendor';

class OrderService {
  async createOrder(buyerId: string, productId: string): Promise<IOrder | null> {
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if product is in stock
    if (product.quantity <= 0) {
      throw new Error('Product out of stock');
    }

    // Get vendor details
    const vendor = await Vendor.findOne({ userId: product.vendor });
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Create order
    const order = await Order.create({
      buyerId,
      vendorId: vendor._id,
      productId,
      amount: product.price,
      status: 'PENDING_PAYMENT'
    });

    return order;
  }

  async updateOrderStatus(orderId: string, status: IOrder['status']): Promise<IOrder | null> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    // If order is completed, update product quantity
    if (status === 'COMPLETED') {
      const product = await Product.findById(order.productId);
      if (product) {
        await Product.findByIdAndUpdate(order.productId, { quantity: product.quantity - 1 });
      }
    }

    return updatedOrder;
  }

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return await Order.findById(orderId);
  }

  async getOrdersByBuyerId(buyerId: string): Promise<IOrder[]> {
    return await Order.find({ buyerId });
  }

  async getOrdersByVendorId(vendorId: string): Promise<IOrder[]> {
    return await Order.find({ vendorId });
  }
}

export default new OrderService();
