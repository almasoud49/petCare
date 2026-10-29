import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { IBlog } from './blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogSchema.pre('validate', function () {
  if (this.isModified('title') && !this.slug)
    this.slug = slugify(this.title, { lower: true, strict: true });
});

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);