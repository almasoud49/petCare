import { Document, Types } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: Types.ObjectId;
  tags: string[];
  published: boolean;
}