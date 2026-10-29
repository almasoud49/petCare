import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPetTag extends Document {
  tagCode: string;         // public QR code
  pet: Types.ObjectId;
  owner: Types.ObjectId;
  isActive: boolean;
  scans: number;
  lastScannedAt?: Date;
}

const petTagSchema = new Schema<IPetTag>(
  {
    tagCode: { type: String, required: true, unique: true, index: true },
    pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isActive: { type: Boolean, default: true },
    scans: { type: Number, default: 0 },
    lastScannedAt: Date,
  },
  { timestamps: true }
);

petTagSchema.pre('validate', function () {
  if (!this.tagCode) {
    const rand = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    this.tagCode = `PET-${rand()}-${rand()}`;
  }
});

export const PetTag = mongoose.model<IPetTag>('PetTag', petTagSchema);