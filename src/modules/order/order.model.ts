import mongoose, { Schema, Document, Types } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

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
  paymentMethod: 'cod' | 'card' | 'bkash' | 'nagad';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  couponCode?: string;
  shippingAddress: {
    email: string;
    name: string;
    phone: string;
    street: string;
    city: string;
    area: string;
    postalCode?: string;
  };
  deliveryZone?: string;
  trackingNumber?: string;
  notes?: string;
  deliveredAt?: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    variantSku: String,
    variantName: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: String,
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'bkash', 'nagad'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    couponCode: String,
    shippingAddress: {
      name: String,
      phone: String,
      street: String,
      city: String,
      area: String,
      postalCode: String,
      email: String
    },
    deliveryZone: String,
    trackingNumber: String,
    notes: String,
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre('validate', function () {
  if (!this.orderNumber)
    this.orderNumber = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 9000 + 1000);
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);