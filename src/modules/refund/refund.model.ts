import mongoose, { Schema, Document, Types } from 'mongoose';

export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type RefundReason = 'damaged' | 'wrong_item' | 'not_received' | 'quality' | 'other';

export interface IRefund extends Document {
  order: Types.ObjectId;
  user: Types.ObjectId;
  items: { product: Types.ObjectId; quantity: number }[];
  reason: RefundReason;
  description: string;
  images: string[];
  status: RefundStatus;
  refundAmount: number;
  adminNote?: string;
  resolvedAt?: Date;
}

const refundSchema = new Schema<IRefund>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [{ product: Schema.Types.ObjectId, quantity: Number }],
    reason: {
      type: String,
      enum: ['damaged', 'wrong_item', 'not_received', 'quality', 'other'],
      required: true,
    },
    description: { type: String, required: true },
    images: [String],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
      index: true,
    },
    refundAmount: { type: Number, required: true, min: 0 },
    adminNote: String,
    resolvedAt: Date,
  },
  { timestamps: true }
);

export const Refund = mongoose.model<IRefund>('Refund', refundSchema);