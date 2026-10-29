import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  user: Types.ObjectId;
  items: { product: Types.ObjectId; addedAt: Date }[];
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);