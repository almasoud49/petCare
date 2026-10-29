import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as contactService from './contact.service';

export const create = catchAsync(async (req: Request, res: Response) => {
  const contact = await contactService.createContact(req.body);
  res.status(201).json(new ApiResponse('Message sent', contact));
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const result = await contactService.listContacts(req.query as any);
  res.json(new ApiResponse('Contacts fetched', result.data, result.meta));
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const contact = await contactService.updateContactStatus(req.params.id as string, req.body.status);
  res.json(new ApiResponse('Status updated', contact));
});