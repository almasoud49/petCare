import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletter extends Document {
  email: string;
  name?: string;
  isSubscribed: boolean;
  preferences: string[];
  source?: string;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: String,
    isSubscribed: { type: Boolean, default: true },
    preferences: { type: [String], default: [] },
    source: String,
  },
  { timestamps: true }
);

export const Newsletter = mongoose.model<INewsletter>('Newsletter', newsletterSchema);