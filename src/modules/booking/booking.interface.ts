import { Document, Types } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IBooking extends Document {
  user: Types.ObjectId;
  service: Types.ObjectId;
  pet: Types.ObjectId;
  date: Date;
  timeSlot: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  aiSuggested?: boolean;
}

export interface CreateBookingInput {
  service: string;
  pet: string;
  date: string;
  timeSlot: string;
  notes?: string;
}