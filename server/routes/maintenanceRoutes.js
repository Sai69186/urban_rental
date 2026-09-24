const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMaintenanceRequests,
  updateMaintenanceStatus,
  confirmResolution,
} = require('../controllers/maintenanceController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { tenantOnly, adminOrOwner } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.post('/', tenantOnly, createRequest);
router.get('/', getMaintenanceRequests);
router.patch('/:id/status', adminOrOwner, updateMaintenanceStatus);
router.patch('/:id/confirm', tenantOnly, confirmResolution);

module.exports = router;
