const Property = require('../models/Property');
const User = require('../models/User');
const logAudit = require('../utils/auditLogger');
const createNotification = require('../utils/notify');

// @desc    Get public approved properties with advanced filters, search, and pagination
// @route   GET /api/properties
// @access  Public
const getPublicProperties = async (req, res, next) => {
  try {
    const {
      city,
      state,
      propertyType,
      minRent,
      maxRent,
      bedrooms,
      bathrooms,
      furnishingStatus,
      amenities,
      availabilityStatus,
      search,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      approvalStatus: 'approved',
    };

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (state) {
      query.state = { $regex: state, $options: 'i' };
    }

    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    if (furnishingStatus && furnishingStatus !== 'All') {
      query.furnishingStatus = furnishingStatus;
    }

    if (availabilityStatus && availabilityStatus !== 'All') {
      query.availabilityStatus = availabilityStatus;
    } else {
      // By default show available or under_application for exploration
      query.availabilityStatus = { $in: ['available', 'under_application'] };
    }

    if (bedrooms && bedrooms !== 'All') {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    if (bathrooms && bathrooms !== 'All') {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOptions = {};
    if (sort === 'lowest_rent') sortOptions = { rent: 1 };
    else if (sort === 'highest_rent') sortOptions = { rent: -1 };
    else if (sort === 'oldest') sortOptions = { createdAt: 1 };
    else sortOptions = { createdAt: -1 }; // newest

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone profileImage isVerified')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property details
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone profileImage isVerified bio createdAt'
    );

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's properties
// @route   GET /api/properties/owner/my-properties
// @access  Owner Only
const getOwnerProperties = async (req, res, next) => {
  try {
    const { status, approvalStatus, search } = req.query;
    const query = { owner: req.user._id };

    if (status && status !== 'All') {
      query.availabilityStatus = status;
    }

    if (approvalStatus && approvalStatus !== 'All') {
      query.approvalStatus = approvalStatus;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property listing
// @route   POST /api/properties
// @access  Owner / Admin
const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      address,
      city,
      state,
      pincode,
      rent,
      securityDeposit,
      bedrooms,
      bathrooms,
      area,
      furnishingStatus,
      amenities,
      images,
      latitude,
      longitude,
    } = req.body;

    if (!title || !description || !propertyType || !address || !city || !state || !pincode || !rent || !securityDeposit || !area) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required property listing details.',
      });
    }

    // Default images if none supplied
    const propertyImages = images && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'];

    const property = await Property.create({
      owner: req.user._id,
      title,
      description,
      propertyType,
      address,
      city,
      state,
      pincode,
      latitude: latitude || 0,
      longitude: longitude || 0,
      rent: Number(rent),
      securityDeposit: Number(securityDeposit),
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      area: Number(area),
      furnishingStatus: furnishingStatus || 'Semi-Furnished',
      amenities: Array.isArray(amenities) ? amenities : (amenities ? amenities.split(',').map((a) => a.trim()) : []),
      images: propertyImages,
      availabilityStatus: 'available',
      // If admin creates, auto-approve; if owner creates, set to pending
      approvalStatus: req.user.role === 'admin' ? 'approved' : 'pending',
    });

    await logAudit({
      user: req.user,
      action: 'PROPERTY_CREATED',
      entity: 'Property',
      entityId: property._id,
      description: `Owner ${req.user.name} created property listing "${property.title}" in ${property.city}`,
      req,
    });

    // Notify admins for approval review
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification({
        recipient: admin._id,
        sender: req.user._id,
        title: 'New Property Listing Pending Approval 🏢',
        message: `Owner ${req.user.name} listed "${property.title}" (${property.city}). Please review for approval.`,
        type: 'property',
        link: '/admin/properties',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Property listing created and submitted for admin approval.',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Owner (own property) or Admin
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Ensure user is property owner or admin
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this property listing.',
      });
    }

    // Update fields
    const updatedData = { ...req.body };
    if (req.body.amenities && typeof req.body.amenities === 'string') {
      updatedData.amenities = req.body.amenities.split(',').map((a) => a.trim());
    }

    // If owner modified core info, re-request approval if previously rejected
    if (req.user.role === 'owner' && property.approvalStatus === 'rejected') {
      updatedData.approvalStatus = 'pending';
    }

    property = await Property.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    await logAudit({
      user: req.user,
      action: 'PROPERTY_UPDATED',
      entity: 'Property',
      entityId: property._id,
      description: `${req.user.role.toUpperCase()} ${req.user.name} updated property listing "${property.title}"`,
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Owner (own property) or Admin
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this property listing.',
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    await logAudit({
      user: req.user,
      action: 'PROPERTY_DELETED',
      entity: 'Property',
      entityId: req.params.id,
      description: `${req.user.role.toUpperCase()} ${req.user.name} deleted property "${property.title}"`,
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Property listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property availability status (available, rented, maintenance)
// @route   PATCH /api/properties/:id/availability
// @access  Owner or Admin
const toggleAvailability = async (req, res, next) => {
  try {
    const { availabilityStatus } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this property status.',
      });
    }

    if (!['available', 'under_application', 'rented', 'maintenance'].includes(availabilityStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability status.',
      });
    }

    property.availabilityStatus = availabilityStatus;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property status changed to ${availabilityStatus}`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicProperties,
  getPropertyById,
  getOwnerProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleAvailability,
};
