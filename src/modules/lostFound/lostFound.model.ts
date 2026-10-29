import mongoose, { Schema, Document, Types } from 'mongoose';

export type LostFoundStatus = 'lost' | 'found' | 'reunited';

export interface ILostFound extends Document {
  pet?: Types.ObjectId;
  reporter: Types.ObjectId;
  status: LostFoundStatus;
  petName: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  color?: string;
  description: string;
  images: string[];
  lastSeenLocation: { lat?: number; lng?: number; address: string };
  lastSeenDate: Date;
  contact: { name: string; phone: string; email?: string };
  reward?: number;
  resolvedAt?: Date;
}

const lostFoundSchema = new Schema<ILostFound>(
  {
    pet: { type: Schema.Types.ObjectId, ref: 'Pet' },
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['lost', 'found', 'reunited'], default: 'lost', index: true },
    petName: { type: String, required: true },
    species: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      required: true,
    },
    breed: String,
    color: String,
    description: { type: String, required: true },
    images: [String],
    lastSeenLocation: {
      lat: Number,
      lng: Number,
      address: { type: String, required: true },
    },
    lastSeenDate: { type: Date, required: true },
    contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
    },
    reward: Number,
    resolvedAt: Date,
  },
  { timestamps: true }
);

lostFoundSchema.index({ 'lastSeenLocation.address': 'text' });

export const LostFound = mongoose.model<ILostFound>('LostFound', lostFoundSchema);