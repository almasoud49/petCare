import { Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  user?: Types.ObjectId;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
}