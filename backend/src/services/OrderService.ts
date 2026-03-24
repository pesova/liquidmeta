import { Types } from 'mongoose';
import { Order, OrderStatus } from '../models/Order';
import { CreateOrderInput } from '../validations/orderValidator';
import { Product } from '../models';

class OrderService {

  public async createOrder(buyerId: string, input: CreateOrderInput) {
    const { productId, quantity, deliveryAddress } = input;

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.quantity < quantity) {
      throw new Error(`Only ${product.quantity} unit(s) available`);
    }    

    const unitPrice = product.price;
    const totalAmount = unitPrice * quantity;

    const order = await Order.create({
      buyerId: new Types.ObjectId(buyerId),
      vendor: product.vendor,
      product: product._id,
      quantity,
      unitPrice,
      totalAmount,
      deliveryAddress,
      status: OrderStatus.PENDING_PAYMENT,
    });

    return order;
  }

  public async getBuyerOrders(buyerId: string) {
    const orders = await Order.find({ buyerId: new Types.ObjectId(buyerId) })
      .populate('product', 'name imageUrl price category')
      .populate('vendor', 'businessName')
      .sort({ createdAt: -1 });

    return orders;
  }

  public async getOrderById(orderId: string, requestingUserId: string) {
    const order = await Order.findById(orderId)
      .populate('product', 'name imageUrl price category')
      .populate('vendor', 'businessName')
      .populate('buyerId', 'name email');
      
    if (!order) {
      throw new Error('Order not found');
    }

    const isOwner =
      order.buyerId._id.toString() === requestingUserId ||
      order.vendor._id.toString() === requestingUserId;

    if (!isOwner) {
      throw new Error('Unauthorised');
    }

    return order;
  }

  public async getVendorOrders(vendorId: string) {
    const orders = await Order.find({ vendor: new Types.ObjectId(vendorId) })
      .populate('product', 'name imageUrl price category')
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 });

    return orders;
  }

  public async markShipped(orderId: string, vendorId: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.vendor.toString() !== vendorId) {
      throw new Error('Unauthorised');
    }
    if (order.status !== OrderStatus.PAID_IN_ESCROW) {
      throw new Error(`Cannot mark as shipped — current status is ${order.status}`);
    }

    order.status = OrderStatus.SHIPPED;
    order.shippedAt = new Date();
    await order.save();

    return order;
  }

  public async confirmDelivery(orderId: string, buyerId: string) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }
    if (order.buyerId.toString() !== buyerId) {
      throw new Error('Unauthorised');
    }
    if (order.status !== OrderStatus.SHIPPED) {
      throw new Error(`Cannot confirm delivery — current status is ${order.status}`);
    }

    order.status = OrderStatus.DELIVERED_PENDING_CONFIRMATION;
    order.deliveredAt = new Date();
    await order.save();

    // TODO: trigger escrow release here once EscrowService is built
    // EscrowService.releaseForOrder(orderId);

    return order;
  }

  public async cancelOrder(orderId: string, requestingUserId: string, role: 'buyer' | 'vendor') {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Only the buyer who created the order can cancel it
    if (order.buyerId.toString() !== requestingUserId) {
      throw new Error('Unauthorised');
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new Error('Buyers can only cancel orders that are pending payment');
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    await order.save();

    return order;
  }
}

export default new OrderService();
