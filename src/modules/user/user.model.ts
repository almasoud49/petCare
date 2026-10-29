import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6, select: false },
    role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' },
    avatar: String,
    phone: String,
    address: String,
    googleId: String,
    isActive: { type: Boolean, default: true },
    preferences: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (pw: string) {
  return bcrypt.compare(pw, this.password || '');
};

export const User = mongoose.model<IUser>('User', userSchema);