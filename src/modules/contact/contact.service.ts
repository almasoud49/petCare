import { Contact } from './contact.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';

export const createContact = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => Contact.create(data);

export const listContacts = async (q: { page?: string; limit?: string; status?: string }) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = {};
  if (q.status) filter.status = q.status;

  const [data, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const updateContactStatus = async (id: string, status: string) => {
  const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
  if (!contact) throw new ApiError(404, 'Contact not found');
  return contact;
};