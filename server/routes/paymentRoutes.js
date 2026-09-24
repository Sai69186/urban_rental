const express = require('express');
const router = express.Router();
const {
  recordPayment,
  getPayments,
  getPaymentById,
} = require('../controllers/paymentController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.post('/', recordPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);

module.exports = router;
