import mongoose, { Schema, Document } from 'mongoose';

export interface IDeliveryZone extends Document {
  name: string;
  cities: string[];
  areas: string[];
  shippingFee: number;
  freeAbove?: number;
  estimatedDays: number;
  isActive: boolean;
}

const zoneSchema = new Schema<IDeliveryZone>(
  {
    name: { type: String, required: true, unique: true },
    cities: [String],
    areas: [String],
    shippingFee: { type: Number, required: true, min: 0 },
    freeAbove: Number,
    estimatedDays: { type: Number, default: 3 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DeliveryZone = mongoose.model<IDeliveryZone>('DeliveryZone', zoneSchema);