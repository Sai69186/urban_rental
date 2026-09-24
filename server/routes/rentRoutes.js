const express = require('express');
const router = express.Router();
const {
  getRentRecords,
  generateRentInvoice,
  getRentSummary,
} = require('../controllers/rentController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { adminOrOwner } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.get('/', getRentRecords);
router.get('/summary', getRentSummary);
router.post('/generate', adminOrOwner, generateRentInvoice);

module.exports = router;
