const express = require('express');
const router = express.Router();
const {
  getPublicProperties,
  getPropertyById,
  getOwnerProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleAvailability,
} = require('../controllers/propertyController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { ownerOnly, adminOrOwner } = require('../middleware/roleMiddleware');

// Public
router.get('/', getPublicProperties);
router.get('/:id', getPropertyById);

// Protected (Owner / Admin)
router.get('/owner/my-properties', authenticateUser, ownerOnly, getOwnerProperties);
router.post('/', authenticateUser, adminOrOwner, createProperty);
router.put('/:id', authenticateUser, adminOrOwner, updateProperty);
router.delete('/:id', authenticateUser, adminOrOwner, deleteProperty);
router.patch('/:id/availability', authenticateUser, adminOrOwner, toggleAvailability);

module.exports = router;
