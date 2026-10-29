import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IArea extends Document {
  name: string;
  slug: string;
  city: string;
  description: string;
  heroImage: string;
  availableServices: string[];
  deliveryFee: number;
  avgRating: number;
  isActive: boolean;
}

const areaSchema = new Schema<IArea>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, index: true },
    city: { type: String, required: true, index: true },
    description: String,
    heroImage: String,
    availableServices: [String],
    deliveryFee: { type: Number, default: 60 },
    avgRating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

areaSchema.pre('validate', function () {
  if (this.isModified('name') && !this.slug)
    this.slug = slugify(this.name, { lower: true, strict: true });
});

export const Area = mongoose.model<IArea>('Area', areaSchema);