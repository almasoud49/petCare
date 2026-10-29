import mongoose, { Schema, Document, Types } from 'mongoose';

export type ReminderType = 'vaccination' | 'grooming' | 'deworming' | 'checkup';
export type ReminderChannel = 'sms' | 'email' | 'both';
export type ReminderStatus = 'pending' | 'sent' | 'cancelled';

export interface IReminder extends Document {
  user: Types.ObjectId;
  pet: Types.ObjectId;
  type: ReminderType;
  title: string;
  message: string;
  scheduledFor: Date;
  channel: ReminderChannel;
  status: ReminderStatus;
  sentAt?: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
    type: {
      type: String,
      enum: ['vaccination', 'grooming', 'deworming', 'checkup'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    scheduledFor: { type: Date, required: true, index: true },
    channel: {
      type: String,
      enum: ['sms', 'email', 'both'],
      default: 'email',
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'cancelled'],
      default: 'pending',
      index: true,
    },
    sentAt: Date,
  },
  { timestamps: true }
);

export const Reminder = mongoose.model<IReminder>('Reminder', reminderSchema);