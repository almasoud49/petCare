import { Document, Types } from 'mongoose';

export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired';

export interface ISubscription extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  variantSku: string;
  quantity: number;
  frequency: SubscriptionFrequency;
  nextDeliveryDate: Date;
  status: SubscriptionStatus;
  totalDeliveries: number;
  completedDeliveries: number;
  price: number;
  discount: number;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    area: string;
    email?: string;
  };
  paymentMethod: 'cod' | 'bkash' | 'card';
}

export interface CreateSubscriptionInput {
  productId: string;
  variantSku: string;
  quantity: number;
  frequency: SubscriptionFrequency;
  shippingAddress: ISubscription['shippingAddress'];
  paymentMethod: 'cod' | 'bkash' | 'card';
}