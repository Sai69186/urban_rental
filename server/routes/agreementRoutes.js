const express = require('express');
const router = express.Router();
const {
  createAgreement,
  getAgreements,
  getAgreementById,
  signAgreement,
  updateAgreementStatus,
} = require('../controllers/agreementController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { adminOrOwner, tenantOnly } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.post('/', adminOrOwner, createAgreement);
router.get('/', getAgreements);
router.get('/:id', getAgreementById);
router.patch('/:id/sign', tenantOnly, signAgreement);
router.patch('/:id/status', adminOrOwner, updateAgreementStatus);

module.exports = router;
