import mongoose, { Schema } from 'mongoose';
import { IChatMessage } from './chat.interface';

const chatSchema = new Schema<IChatMessage>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', chatSchema);