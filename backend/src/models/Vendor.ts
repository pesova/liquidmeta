import mongoose, { Document, Schema } from 'mongoose';

export interface IVendor extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  nin: string;
  phoneNumber: string;
  ninData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true
  },
  nin: {
    type: String,
    required: true,
    unique: true,
    select: false
  },
  ninData: {
    type: Schema.Types.Mixed,
    default: null,
    select: false
  },
  phoneNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});


export const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema);