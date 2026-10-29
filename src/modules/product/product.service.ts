import { Product } from './product.model';
import { Category } from '../category/category.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';
import {
  CreateProductInput,
  ProductListQuery,
} from './product.interface';

export const createProduct = async (data: CreateProductInput) => {
  const category = await Category.findById(data.category);
  if (!category) throw new ApiError(404, 'Category not found');
  return Product.create(data);
};

export const listProducts = async (q: ProductListQuery) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = { isActive: true };

  if (q.search) filter.$text = { $search: q.search };
  if (q.category) filter.category = q.category;
  if (q.type) filter.type = q.type;
  if (q.species) filter.species = q.species;
  if (q.ageGroup) filter.ageGroup = q.ageGroup;
  if (q.size) filter.size = q.size;
  if (q.brand) filter.brand = new RegExp(q.brand, 'i');

  if (q.minPrice || q.maxPrice) {
    filter.basePrice = {};
    if (q.minPrice) filter.basePrice.$gte = Number(q.minPrice);
    if (q.maxPrice) filter.basePrice.$lte = Number(q.maxPrice);
  }

  if (q.minRating) filter.rating = { $gte: Number(q.minRating) };
  if (q.inStock === 'true') filter.stock = { $gt: 0 };
  if (q.flashSale === 'true')
    filter.comparePrice = { $exists: true, $gt: 0 };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc: { basePrice: 1 },
    price_desc: { basePrice: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
    best_selling: { sold: -1 },
  };
  const sort = sortMap[q.sort || 'newest'];

  const [data, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id)
    .populate('category', 'name slug')
    .lean();
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

export const getProductBySlug = async (slug: string) => {
  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug')
    .lean();
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

export const getRelatedProducts = async (product: any) => {
  const filter: any = {
    _id: { $ne: product._id },
    type: product.type,
    species: { $in: product.species },
    isActive: true,
  };
  return Product.find(filter).limit(8).lean();
};

export const updateProduct = async (
  id: string,
  updates: Partial<CreateProductInput>
) => {
  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, 'Product not found');
};

export const getFlashSaleProducts = async () =>
  Product.find({
    isActive: true,
    comparePrice: { $exists: true, $gt: 0 },
  } as any)
    .sort({ sold: -1 })
    .limit(12)
    .lean();

export const getFeaturedProducts = async () =>
  Product.find({ isActive: true, isFeatured: true } as any)
    .limit(8)
    .lean();