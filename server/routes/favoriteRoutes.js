const express = require('express');
const router = express.Router();
const {
  toggleFavorite,
  getFavorites,
  checkFavorite,
} = require('../controllers/favoriteController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { tenantOnly } = require('../middleware/roleMiddleware');

router.use(authenticateUser, tenantOnly);

router.post('/toggle', toggleFavorite);
router.get('/', getFavorites);
router.get('/check/:propertyId', checkFavorite);

module.exports = router;
