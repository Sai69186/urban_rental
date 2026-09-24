const Favorite = require('../models/Favorite');

// @desc    Toggle favorite status for property
// @route   POST /api/favorites/toggle
// @access  Tenant
const toggleFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'Property ID is required' });
    }

    const existingFav = await Favorite.findOne({
      tenant: req.user._id,
      property: propertyId,
    });

    if (existingFav) {
      await Favorite.findByIdAndDelete(existingFav._id);
      return res.status(200).json({
        success: true,
        isFavorited: false,
        message: 'Removed from saved properties',
      });
    } else {
      await Favorite.create({
        tenant: req.user._id,
        property: propertyId,
      });
      return res.status(200).json({
        success: true,
        isFavorited: true,
        message: 'Added to saved properties',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in tenant favorites
// @route   GET /api/favorites
// @access  Tenant
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ tenant: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email phone profileImage isVerified' },
      })
      .sort({ createdAt: -1 });

    const validFavorites = favorites.filter((f) => f.property !== null);

    res.status(200).json({
      success: true,
      count: validFavorites.length,
      data: validFavorites.map((f) => f.property),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if property is favorited
// @route   GET /api/favorites/check/:propertyId
// @access  Tenant
const checkFavorite = async (req, res, next) => {
  try {
    const fav = await Favorite.findOne({
      tenant: req.user._id,
      property: req.params.propertyId,
    });

    res.status(200).json({
      success: true,
      isFavorited: !!fav,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
  checkFavorite,
};
