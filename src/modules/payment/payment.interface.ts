import { Document, Types } from 'mongoose';

export type PaymentProvider = 'sslcommerz' | 'bkash' | 'nagad' | 'cod' | 'mock';

export type PaymentStatus =
  | 'initiated'
  | 'pending'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface IPayment extends Document {
  order: Types.ObjectId;
  user: Types.ObjectId;
  provider: PaymentProvider;
  providerRef?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  rawResponse?: Record<string, any>;
  refundInfo?: {
    refundedAt: Date;
    amount: number;
    reason?: string;
    ref?: string;
  };
}