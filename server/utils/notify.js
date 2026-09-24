const Notification = require('../models/Notification');

const createNotification = async ({ recipient, sender, title, message, type = 'general', link = '' }) => {
  try {
    if (!recipient) return null;
    return await Notification.create({
      recipient,
      sender: sender || null,
      title,
      message,
      type,
      link,
    });
  } catch (error) {
    console.error('Notification creation error:', error.message);
    return null;
  }
};

module.exports = createNotification;
