import mongoose, { Schema, Document, Types } from 'mongoose';
import slugify from 'slugify';

export interface IBundle extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  products: { product: Types.ObjectId; variantSku: string; quantity: number }[];
  bundlePrice: number;
  comparePrice: number;
  discountPercent: number;
  isActive: boolean;
  validUntil?: Date;
}

const bundleSchema = new Schema<IBundle>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    description: String,
    image: String,
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variantSku: { type: String, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    bundlePrice: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    validUntil: Date,
  },
  { timestamps: true }
);

bundleSchema.pre('validate', function () {
  if (this.isModified('name') && !this.slug)
    this.slug = slugify(this.name, { lower: true, strict: true });
  if (this.comparePrice > 0 && this.bundlePrice > 0) {
    this.discountPercent = Math.round(
      ((this.comparePrice - this.bundlePrice) / this.comparePrice) * 100
    );
  }
});

export const Bundle = mongoose.model<IBundle>('Bundle', bundleSchema);