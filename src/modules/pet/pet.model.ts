import mongoose, { Schema } from 'mongoose';
import { IPet } from './pet.interface';

const petSchema = new Schema<IPet>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    species: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
      required: true,
    },
    breed: String,
    age: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
    gender: { type: String, enum: ['male', 'female'] },
    image: String,
    notes: String,
  },
  { timestamps: true }
);

export const Pet = mongoose.model<IPet>('Pet', petSchema);