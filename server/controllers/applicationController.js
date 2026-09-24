const Application = require('../models/Application');
const Property = require('../models/Property');
const User = require('../models/User');
const logAudit = require('../utils/auditLogger');
const createNotification = require('../utils/notify');

// @desc    Apply for a rental property
// @route   POST /api/applications
// @access  Tenant Only
const createApplication = async (req, res, next) => {
  try {
    const {
      propertyId,
      moveInDate,
      employmentStatus,
      monthlyIncome,
      numberOfOccupants,
      message,
      documents,
    } = req.body;

    if (!propertyId || !moveInDate || !monthlyIncome) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property ID, move-in date, and monthly income.',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.approvalStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This property is not currently approved for rental listings.',
      });
    }

    if (property.availabilityStatus === 'rented') {
      return res.status(400).json({
        success: false,
        message: 'This property has already been rented out.',
      });
    }

    // Check if tenant has an existing active application for this property
    const existingApp = await Application.findOne({
      tenant: req.user._id,
      property: propertyId,
      status: { $in: ['pending', 'under_review', 'approved'] },
    });

    if (existingApp) {
      return res.status(409).json({
        success: false,
        message: 'You already have an active application submitted for this property.',
      });
    }

    const application = await Application.create({
      tenant: req.user._id,
      property: propertyId,
      owner: property.owner,
      moveInDate,
      employmentStatus: employmentStatus || 'Employed',
      monthlyIncome: Number(monthlyIncome),
      numberOfOccupants: Number(numberOfOccupants) || 1,
      message: message || '',
      documents: documents || [],
      status: 'pending',
    });

    // Update property availability to under_application if currently available
    if (property.availabilityStatus === 'available') {
      property.availabilityStatus = 'under_application';
      await property.save();
    }

    await logAudit({
      user: req.user,
      action: 'APPLICATION_SUBMITTED',
      entity: 'Application',
      entityId: application._id,
      description: `Tenant ${req.user.name} submitted application for "${property.title}"`,
      req,
    });

    // Notify owner
    await createNotification({
      recipient: property.owner,
      sender: req.user._id,
      title: 'New Rental Application Received 📩',
      message: `${req.user.name} applied to rent "${property.title}" starting ${new Date(moveInDate).toLocaleDateString()}.`,
      type: 'application',
      link: '/owner/applications',
    });

    res.status(201).json({
      success: true,
      message: 'Rental application submitted successfully!',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for logged-in tenant
// @route   GET /api/applications/my-applications
// @access  Tenant Only
const getTenantApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ tenant: req.user._id })
      .populate('property')
      .populate('owner', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications received by owner
// @route   GET /api/applications/owner
// @access  Owner Only
const getOwnerApplications = async (req, res, next) => {
  try {
    const { status, propertyId } = req.query;
    const query = { owner: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (propertyId) {
      query.property = propertyId;
    }

    const applications = await Application.find(query)
      .populate('property')
      .populate('tenant', 'name email phone profileImage isVerified bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private (Owner, Tenant, Admin)
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('property')
      .populate('tenant', 'name email phone profileImage bio address')
      .populate('owner', 'name email phone profileImage');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const isOwner = application.owner._id.toString() === req.user._id.toString();
    const isTenant = application.tenant._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isTenant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this application.',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Approve / Reject / Under Review)
// @route   PATCH /api/applications/:id/status
// @access  Owner or Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, ownerNotes } = req.body;
    const application = await Application.findById(req.params.id).populate('property');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const isOwner = application.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the property owner or administrator can update this application.',
      });
    }

    if (!['pending', 'under_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    application.status = status;
    if (ownerNotes !== undefined) application.ownerNotes = ownerNotes;
    await application.save();

    await logAudit({
      user: req.user,
      action: `APPLICATION_${status.toUpperCase()}`,
      entity: 'Application',
      entityId: application._id,
      description: `${req.user.name} marked application as ${status} for property "${application.property?.title}"`,
      req,
    });

    // Notify tenant
    const statusMessages = {
      approved: `Great news! Your rental application for "${application.property?.title}" has been approved! The owner will issue your lease agreement.`,
      rejected: `Your rental application for "${application.property?.title}" was not accepted at this time.`,
      under_review: `Your application for "${application.property?.title}" is currently under review by the property owner.`,
    };

    await createNotification({
      recipient: application.tenant,
      sender: req.user._id,
      title: `Application ${status.replace('_', ' ').toUpperCase()} 📋`,
      message: statusMessages[status] || `Your application status changed to ${status}.`,
      type: 'application',
      link: '/tenant/applications',
    });

    res.status(200).json({
      success: true,
      message: `Application marked as ${status}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   PATCH /api/applications/:id/withdraw
// @access  Tenant Only
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only withdraw your own applications.',
      });
    }

    if (application.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw an already approved application. Please contact the owner.',
      });
    }

    application.status = 'withdrawn';
    await application.save();

    await logAudit({
      user: req.user,
      action: 'APPLICATION_WITHDRAWN',
      entity: 'Application',
      entityId: application._id,
      description: `Tenant ${req.user.name} withdrew their application`,
      req,
    });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getTenantApplications,
  getOwnerApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
};
