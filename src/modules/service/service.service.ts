import mongoose from 'mongoose';
import { Service } from './service.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';
import { CreateServiceInput, ServiceListQuery, IService } from './service.interface';

export const createService = async (data: CreateServiceInput) => Service.create(data);

export const listServices = async (q: ServiceListQuery) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: Record<string, any> = { isActive: true };

  if (q.search) filter.$text = { $search: q.search };
  if (q.category) filter.category = q.category;
  if (q.location) filter.location = new RegExp(q.location, 'i');
  if (q.minPrice || q.maxPrice) {
    filter.price = {};
    if (q.minPrice) filter.price.$gte = Number(q.minPrice);
    if (q.maxPrice) filter.price.$lte = Number(q.maxPrice);
  }
  if (q.minRating) filter.rating = { $gte: Number(q.minRating) };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
  };
  const sort = sortMap[q.sort || 'newest'];

  const [data, total] = await Promise.all([
    Service.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Service.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getServiceById = async (id: string) => {
  const service = await Service.findById(id).lean();
  if (!service) throw new ApiError(404, 'Service not found');
  return service;
};

export const getRelatedServices = async (id: string, category: string) => {
  const filter: any = {
    _id: { $ne: id },
    category,
    isActive: true,
  };
  return Service.find(filter).limit(4).lean();
};

export const updateService = async (id: string, updates: Partial<CreateServiceInput>) => {
  const service = await Service.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!service) throw new ApiError(404, 'Service not found');
  return service;
};

export const deleteService = async (id: string) => {
  const service = await Service.findByIdAndDelete(id);
  if (!service) throw new ApiError(404, 'Service not found');
};

export const getServiceStats = async () =>
  Service.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
  ]);