const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} = require('../controllers/complaintController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.post('/', createComplaint);
router.get('/', getComplaints);
router.patch('/:id/status', adminOnly, updateComplaintStatus);

module.exports = router;
