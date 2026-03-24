import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  buyerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  amount: number;
  status: 'PENDING_PAYMENT' | 'PAID_IN_ESCROW' | 'SHIPPED' | 'DELIVERED_PENDING_CONFIRMATION' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [
      'PENDING_PAYMENT',
      'PAID_IN_ESCROW',
      'SHIPPED',
      'DELIVERED_PENDING_CONFIRMATION',
      'COMPLETED',
      'CANCELLED'
    ],
    default: 'PENDING_PAYMENT',
    required: true
  }
}, {
  timestamps: true
});

orderSchema.index({ buyerId: 1 });
orderSchema.index({ vendorId: 1 });
orderSchema.index({ productId: 1 });
orderSchema.index({ status: 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);