import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergency extends Document {
  name: string;
  phone: string;
  area: string;
  city: string;
  address: string;
  is24_7: boolean;
  isActive: boolean;
  lat?: number;
  lng?: number;
}

const emergencySchema = new Schema<IEmergency>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    area: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    address: String,
    is24_7: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    lat: Number,
    lng: Number,
  },
  { timestamps: true }
);

export const Emergency = mongoose.model<IEmergency>('Emergency', emergencySchema);