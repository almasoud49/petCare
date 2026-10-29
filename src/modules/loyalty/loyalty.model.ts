import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILoyalty extends Document {
  user: Types.ObjectId;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  history: { change: number; reason: string; at: Date }[];
}

const loyaltySchema = new Schema<ILoyalty>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    points: { type: Number, default: 0 },
    tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
    totalSpent: { type: Number, default: 0 },
    history: [
      {
        change: Number,
        reason: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

loyaltySchema.methods.recomputeTier = function () {
  if (this.totalSpent >= 50000) this.tier = 'platinum';
  else if (this.totalSpent >= 20000) this.tier = 'gold';
  else if (this.totalSpent >= 5000) this.tier = 'silver';
  else this.tier = 'bronze';
};

export const Loyalty = mongoose.model<ILoyalty>('Loyalty', loyaltySchema);