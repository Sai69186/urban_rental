const express = require('express');
const router = express.Router();
const {
  createApplication,
  getTenantApplications,
  getOwnerApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
} = require('../controllers/applicationController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { tenantOnly, ownerOnly, adminOrOwner } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.post('/', tenantOnly, createApplication);
router.get('/my-applications', tenantOnly, getTenantApplications);
router.get('/owner', ownerOnly, getOwnerApplications);
router.get('/:id', getApplicationById);
router.patch('/:id/status', adminOrOwner, updateApplicationStatus);
router.patch('/:id/withdraw', tenantOnly, withdrawApplication);

module.exports = router;
