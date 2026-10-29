import { Document } from 'mongoose';

export type Role = 'user' | 'manager' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar?: string;
  phone?: string;
  address?: string;
  googleId?: string;
  isActive: boolean;
  preferences: string[];
  comparePassword(pw: string): Promise<boolean>;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role;
  phone?: string;
}

export interface UpdateUserInput {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  preferences?: string[];
}