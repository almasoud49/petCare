import mongoose, { Schema } from 'mongoose';
import { ISubscription } from './subscription.interface';

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      required: true,
    },
    nextDeliveryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled', 'expired'],
      default: 'active',
      index: true,
    },
    totalDeliveries: { type: Number, default: 0 },
    completedDeliveries: { type: Number, default: 0 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      area: String,
      email: String,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bkash', 'card'],
      default: 'cod',
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>(
  'Subscription',
  subscriptionSchema
);