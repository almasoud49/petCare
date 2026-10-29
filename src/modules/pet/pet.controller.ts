import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as petService from './pet.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const pet = await petService.createPet(req.user!.id, req.body);
  res.status(201).json(new ApiResponse('Pet added', pet));
});

export const listMine = catchAsync(async (req: Request, res: Response) => {
  const pets = await petService.listUserPets(req.user!.id);
  res.json(new ApiResponse('Pets fetched', pets));
});

export const detail = catchAsync(async (req: Request, res: Response) => {
  const pet = await petService.getPetById(req.params.id as string, req.user!.id);
  res.json(new ApiResponse('Pet fetched', pet));
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const pet = await petService.updatePet(req.params.id as string, req.user!.id, req.body);
  res.json(new ApiResponse('Pet updated', pet));
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  await petService.deletePet(req.params.id as string, req.user!.id);
  res.json(new ApiResponse('Pet deleted', null));
});