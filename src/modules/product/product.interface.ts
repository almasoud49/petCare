import { Document, Types } from 'mongoose';

export type ProductSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'fish' | 'other';

export type ProductType =
  | 'food'
  | 'treats'
  | 'litter'
  | 'toy'
  | 'accessory'
  | 'grooming'
  | 'health'
  | 'housing';

export type AgeGroup = 'puppy' | 'kitten' | 'adult' | 'senior' | 'all';
export type SizeGroup = 'small' | 'medium' | 'large' | 'all';

export interface IVariant {
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  image?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  category: Types.ObjectId;
  type: ProductType;
  species: ProductSpecies[];
  ageGroup: AgeGroup[];
  size: SizeGroup[];
  description: string;
  shortDescription: string;
  images: string[];
  variants: IVariant[];
  basePrice: number;
  comparePrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  sold: number;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  aiTags?: string[];
}

export interface CreateProductInput {
  name: string;
  brand: string;
  category: string;
  type: ProductType;
  species: ProductSpecies[];
  ageGroup?: AgeGroup[];
  size?: SizeGroup[];
  description: string;
  shortDescription: string;
  images: string[];
  variants: IVariant[];
  tags?: string[];
}

export interface ProductListQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  type?: ProductType;
  species?: ProductSpecies;
  ageGroup?: AgeGroup;
  size?: SizeGroup;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  inStock?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'best_selling';
  flashSale?: string;
}