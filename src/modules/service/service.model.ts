import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { IService } from './service.interface';

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ['grooming', 'vet', 'boarding', 'training', 'walking'],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    durationMinutes: { type: Number, default: 60 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    location: { type: String, required: true },
    image: { type: String, required: true },
    gallery: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });

serviceSchema.pre('validate', function () {
  if (this.isModified('title') && !this.slug)
    this.slug = slugify(this.title, { lower: true, strict: true });
});

export const Service = mongoose.model<IService>('Service', serviceSchema);