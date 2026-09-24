const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserStatus,
  verifyUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(authenticateUser);

router.get('/', adminOnly, getUsers);
router.get('/:id', getUserById);
router.patch('/:id/status', adminOnly, updateUserStatus);
router.patch('/:id/verify', adminOnly, verifyUser);
router.delete('/:id', adminOnly, deleteUser);

module.exports = router;
