const AuditLog = require('../models/AuditLog');

const logAudit = async ({ user, action, entity, entityId, description, req }) => {
  try {
    const ipAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '';
    const userAgent = req?.headers['user-agent'] || '';

    await AuditLog.create({
      user: user?._id || user?.id || null,
      userName: user?.name || 'System / Anonymous',
      userRole: user?.role || 'system',
      action,
      entity,
      entityId: entityId ? entityId.toString() : '',
      description,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Audit log creation error:', error.message);
  }
};

module.exports = logAudit;
