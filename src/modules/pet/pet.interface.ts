import { Document, Types } from 'mongoose';

export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
export type Gender = 'male' | 'female';

export interface IPet extends Document {
  owner: Types.ObjectId;
  name: string;
  species: Species;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: Gender;
  image?: string;
  notes?: string;
}

export interface CreatePetInput {
  name: string;
  species: Species;
  breed?: string;
  age?: number;
  weight?: number;
  gender?: Gender;
  image?: string;
  notes?: string;
}