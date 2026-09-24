const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  setPropertyApproval,
  getAdminProperties,
  getAuditLogs,
  broadcastNotification,
} = require('../controllers/adminController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(authenticateUser, adminOnly);

router.get('/dashboard-stats', getDashboardStats);
router.get('/properties', getAdminProperties);
router.patch('/properties/:id/approval', setPropertyApproval);
router.get('/audit-logs', getAuditLogs);
router.post('/broadcast', broadcastNotification);

module.exports = router;
