import { Document } from 'mongoose';

export type ServiceCategory = 'grooming' | 'vet' | 'boarding' | 'training' | 'walking';

export interface IService extends Document {
  title: string;
  slug: string;
  category: ServiceCategory;
  description: string;
  price: number;
  durationMinutes: number;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  gallery: string[];
  tags: string[];
  isActive: boolean;
}

export interface CreateServiceInput {
  title: string;
  category: ServiceCategory;
  description: string;
  price: number;
  location: string;
  image: string;
  durationMinutes?: number;
  gallery?: string[];
  tags?: string[];
}

export interface ServiceListQuery {
  page?: string;
  limit?: string;
  search?: string;
  category?: ServiceCategory;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  location?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}