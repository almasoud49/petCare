import mongoose, { Schema, Document, Types } from 'mongoose';

export type AdoptionStatus = 'available' | 'pending' | 'adopted';

export interface IAdoption extends Document {
  poster: Types.ObjectId;
  petName: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  age?: number;
  gender?: 'male' | 'female';
  description: string;
  images: string[];
  vaccinated: boolean;
  neutered: boolean;
  location: string;
  contact: { name: string; phone: string; email?: string };
  status: AdoptionStatus;
  applications: Types.ObjectId[];
}

const adoptionSchema = new Schema<IAdoption>(
  {
    poster: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    petName: { type: String, required: true },
    species: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      required: true,
    },
    breed: String,
    age: Number,
    gender: { type: String, enum: ['male', 'female'] },
    description: { type: String, required: true },
    images: [String],
    vaccinated: { type: Boolean, default: false },
    neutered: { type: Boolean, default: false },
    location: { type: String, required: true },
    contact: {
      name: String,
      phone: String,
      email: String,
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'adopted'],
      default: 'available',
      index: true,
    },
    applications: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Adoption = mongoose.model<IAdoption>('Adoption', adoptionSchema);