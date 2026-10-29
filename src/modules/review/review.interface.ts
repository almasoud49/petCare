import { Document, Types } from 'mongoose';

export interface IReview extends Document {
  user: Types.ObjectId;
  service: Types.ObjectId;
  rating: number;
  comment: string;
}