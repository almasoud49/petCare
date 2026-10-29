import { Blog } from './blog.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';

export const createBlog = async (authorId: string, data: any) =>
  Blog.create({ ...data, author: authorId });

export const listBlogs = async (q: { page?: string; limit?: string; search?: string }) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = { published: true };
  if (q.search) filter.title = new RegExp(q.search, 'i');

  const [data, total] = await Promise.all([
    Blog.find(filter)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await Blog.findOne({ slug, published: true })
    .populate('author', 'name avatar')
    .lean();
  if (!blog) throw new ApiError(404, 'Blog not found');
  return blog;
};

export const updateBlog = async (id: string, updates: any) => {
  const blog = await Blog.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!blog) throw new ApiError(404, 'Blog not found');
  return blog;
};

export const deleteBlog = async (id: string) => {
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new ApiError(404, 'Blog not found');
};