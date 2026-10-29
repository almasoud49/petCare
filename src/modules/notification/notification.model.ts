import mongoose, { Schema, Document, Types } from 'mongoose';

export type NotifType = 'order' | 'booking' | 'promo' | 'system' | 'ai' | 'lostFound';

export interface INotification extends Document {
  user: Types.ObjectId;
  type: NotifType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
}

const notifSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['order', 'booking', 'promo', 'system', 'ai', 'lostFound'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: String,
    isRead: { type: Boolean, default: false, index: true },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', notifSchema);