import mongoose, { Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: {
      type: String,
      enum: ['sslcommerz', 'bkash', 'nagad', 'cod', 'mock'],
      required: true,
    },
    providerRef: { type: String, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'BDT' },
    status: {
      type: String,
      enum: ['initiated', 'pending', 'success', 'failed', 'cancelled', 'refunded'],
      default: 'initiated',
      index: true,
    },
    rawResponse: Schema.Types.Mixed,
    refundInfo: {
      refundedAt: Date,
      amount: Number,
      reason: String,
      ref: String,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);