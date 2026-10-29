import { Pet } from './pet.model';
import { ApiError } from '../../utils/ApiError';
import { CreatePetInput } from './pet.interface';
import { Types } from 'mongoose';

export const createPet = async (ownerId: string, data: CreatePetInput) =>
  Pet.create({ ...data, owner: ownerId });

export const listUserPets = async (ownerId: string) =>
  Pet.find({ owner: ownerId }).sort({ createdAt: -1 }).lean();

export const getPetById = async (id: string, ownerId: string) => {
  const pet = await Pet.findOne({ _id: id, owner: ownerId }).lean();
  if (!pet) throw new ApiError(404, 'Pet not found');
  return pet;
};

export const updatePet = async (id: string, ownerId: string, updates: Partial<CreatePetInput>) => {
  const pet = await Pet.findOneAndUpdate(
    { _id: id, owner: ownerId },
    updates,
    { new: true, runValidators: true }
  );
  if (!pet) throw new ApiError(404, 'Pet not found');
  return pet;
};

export const deletePet = async (id: string, ownerId: string) => {
  const pet = await Pet.findOneAndDelete({ _id: id, owner: ownerId });
  if (!pet) throw new ApiError(404, 'Pet not found');
};

export const countPetsByOwner = async (ownerId: string) =>
  Pet.countDocuments({ owner: new Types.ObjectId(ownerId) });