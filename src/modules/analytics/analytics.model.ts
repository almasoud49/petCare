import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  event: string;              // 'page_view' | 'product_view' | 'add_to_cart' | 'purchase'
  userId?: string;
  sessionId: string;
  path: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

const analyticsSchema = new Schema<IAnalyticsEvent>(
  {
    event: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    sessionId: { type: String, required: true, index: true },
    path: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>(
  'AnalyticsEvent',
  analyticsSchema
);