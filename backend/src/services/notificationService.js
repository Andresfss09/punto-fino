const Notification = require('../models/Notification');

exports.createNotification = async ({ recipient, type, title, message, data }) => {
  try {
    const notification = await Notification.create({ recipient, type, title, message, data });
    return notification;
  } catch (error) {
    console.error('Error creando notificación:', error.message);
  }
};

exports.getNotifications = async (userId, limit = 20) => {
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

exports.markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

exports.markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};