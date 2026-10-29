import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBlogLike extends Document {
  user: Types.ObjectId;
  blog: Types.ObjectId;
}

export interface IBlogComment extends Document {
  user: Types.ObjectId;
  blog: Types.ObjectId;
  content: string;
  parent?: Types.ObjectId;
  isEdited: boolean;
}

const likeSchema = new Schema<IBlogLike>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  },
  { timestamps: true }
);
likeSchema.index({ user: 1, blog: 1 }, { unique: true });

const commentSchema = new Schema<IBlogComment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true, index: true },
    content: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: 'BlogComment' },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BlogLike = mongoose.model<IBlogLike>('BlogLike', likeSchema);
export const BlogComment = mongoose.model<IBlogComment>('BlogComment', commentSchema);