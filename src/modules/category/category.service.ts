import { Category } from './category.model';
import { ApiError } from '../../utils/ApiError';

export const createCategory = async (data: any) => Category.create(data);

export const listCategories = async () =>
  Category.find({ isActive: true }).sort({ order: 1 }).lean();

export const getCategoryTree = async () => {
  const all = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
  const parents = all.filter((c) => !c.parent);
  return parents.map((p) => ({
    ...p,
    children: all.filter((c) => c.parent?.toString() === p._id.toString()),
  }));
};

export const updateCategory = async (id: string, data: any) => {
  const cat = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!cat) throw new ApiError(404, 'Category not found');
  return cat;
};

export const deleteCategory = async (id: string) => {
  const cat = await Category.findByIdAndDelete(id);
  if (!cat) throw new ApiError(404, 'Category not found');
};