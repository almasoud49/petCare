import { Document, Types } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod = 'cod' | 'card' | 'bkash' | 'nagad';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  variantSku: string;
  variantName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  couponCode?: string;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    area: string;
    postalCode?: string;
    email?: string;
  };
  deliveryZone?: string;
  trackingNumber?: string;
  notes?: string;
  deliveredAt?: Date;
}