import { Document } from 'mongoose';

export type ContactStatus = 'new' | 'read' | 'replied';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
}