import mongoose, { Schema } from 'mongoose';
import { IFaq } from './faq.interface';

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'general' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Faq = mongoose.model<IFaq>('Faq', faqSchema);