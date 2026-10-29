import { Faq } from './faq.model';
import { ApiError } from '../../utils/ApiError';

export const listFaqs = async () => Faq.find().sort({ order: 1 }).lean();

export const createFaq = async (data: any) => Faq.create(data);

export const updateFaq = async (id: string, data: any) => {
  const faq = await Faq.findByIdAndUpdate(id, data, { new: true });
  if (!faq) throw new ApiError(404, 'FAQ not found');
  return faq;
};

export const deleteFaq = async (id: string) => {
  const faq = await Faq.findByIdAndDelete(id);
  if (!faq) throw new ApiError(404, 'FAQ not found');
};