import mongoose, { Document, Schema } from 'mongoose';

export interface IEscrowTransaction extends Document {
  orderId: mongoose.Types.ObjectId;
  amount: number;
  status: 'HELD' | 'RELEASED' | 'REFUNDED';
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const escrowTransactionSchema = new Schema<IEscrowTransaction>({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['HELD', 'RELEASED', 'REFUNDED'],
    default: 'HELD',
    required: true
  },
  releasedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

escrowTransactionSchema.pre<IEscrowTransaction>('save', async function() {
  if (this.isModified('status') && this.status === 'RELEASED' && !this.releasedAt) {
    this.releasedAt = new Date();
  }
});

export const EscrowTransaction = mongoose.model<IEscrowTransaction>('EscrowTransaction', escrowTransactionSchema);