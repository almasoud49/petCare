import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISpotlight extends Document {
  user: Types.ObjectId;
  pet: Types.ObjectId;
  petName: string;
  image: string;
  caption: string;
  likes: Types.ObjectId[];
  isFeatured: boolean;
  isApproved: boolean;
}

const spotlightSchema = new Schema<ISpotlight>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pet: { type: Schema.Types.ObjectId, ref: 'Pet' },
    petName: { type: String, required: true },
    image: { type: String, required: true },
    caption: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isFeatured: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Spotlight = mongoose.model<ISpotlight>('Spotlight', spotlightSchema);