import { Notification, NotifType } from './notification.model';

export const notify = (
  userId: string,
  type: NotifType,
  title: string,
  message: string,
  link?: string,
  metadata?: any
) => Notification.create({ user: userId, type, title, message, link, metadata });

export const listNotifications = (userId: string) =>
  Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50).lean();

export const markAsRead = (id: string, userId: string) =>
  Notification.findOneAndUpdate({ _id: id, user: userId }, { isRead: true }, { new: true });

export const markAllAsRead = (userId: string) =>
  Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

export const unreadCount = (userId: string) =>
  Notification.countDocuments({ user: userId, isRead: false });