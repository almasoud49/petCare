import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { IProduct } from './product.interface';

const variantSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    image: String,
  },
  { _id: true }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    brand: { type: String, required: true, index: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['food', 'treats', 'litter', 'toy', 'accessory', 'grooming', 'health', 'housing'],
      required: true,
      index: true,
    },
    species: {
      type: [String],
      enum: ['dog', 'cat', 'bird', 'rabbit', 'fish', 'other'],
      index: true,
    },
    ageGroup: {
      type: [String],
      enum: ['puppy', 'kitten', 'adult', 'senior', 'all'],
      default: ['all'],
      index: true,
    },
    size: {
      type: [String],
      enum: ['small', 'medium', 'large', 'all'],
      default: ['all'],
      index: true,
    },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    images: { type: [String], required: true },
    variants: { type: [variantSchema], required: true },
    basePrice: { type: Number, required: true, index: true },
    comparePrice: Number,
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    aiTags: { type: [String], default: [] },
  },
  { timestamps: true }
);

productSchema.index({
  name: 'text',
  brand: 'text',
  description: 'text',
  tags: 'text',
});

productSchema.pre('validate', function () {
  if (this.isModified('name') && !this.slug)
    this.slug = slugify(this.name, { lower: true, strict: true });

  if (this.isModified('variants') || this.isNew) {
    if (this.variants && this.variants.length > 0) {
      const prices = this.variants.map((v) => v.price);
      this.basePrice = Math.min(...prices);
      this.stock = this.variants.reduce((s, v) => s + v.stock, 0);
    }
  }
});

export const Product = mongoose.model<IProduct>('Product', productSchema);