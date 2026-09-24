const Agreement = require('../models/Agreement');
const Property = require('../models/Property');
const Application = require('../models/Application');
const Rent = require('../models/Rent');
const logAudit = require('../utils/auditLogger');
const createNotification = require('../utils/notify');

// @desc    Create a new rental agreement (Owner creates after approving application)
// @route   POST /api/agreements
// @access  Owner or Admin
const createAgreement = async (req, res, next) => {
  try {
    const {
      applicationId,
      propertyId,
      tenantId,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      dueDate,
      terms,
    } = req.body;

    if (!propertyId || !tenantId || !startDate || !endDate || !monthlyRent || !securityDeposit) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required lease agreement terms.',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create an agreement for this property.',
      });
    }

    const agreement = await Agreement.create({
      owner: req.user._id,
      tenant: tenantId,
      property: propertyId,
      application: applicationId || null,
      startDate,
      endDate,
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit),
      dueDate: Number(dueDate) || 5,
      terms: terms || undefined,
      status: 'active',
      ownerSignature: {
        signed: true,
        signedAt: new Date(),
        signedBy: req.user.name,
      },
    });

    // Update property status to 'rented'
    property.availabilityStatus = 'rented';
    await property.save();

    // If application exists, ensure it is marked approved
    if (applicationId) {
      await Application.findByIdAndUpdate(applicationId, { status: 'approved' });
    }

    // Auto-generate first 3 months rent records
    const start = new Date(startDate);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    for (let i = 0; i < 3; i++) {
      const targetDate = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const rentMonth = months[targetDate.getMonth()];
      const rentYear = targetDate.getFullYear();
      const rentDueDate = new Date(rentYear, targetDate.getMonth(), agreement.dueDate || 5);

      await Rent.create({
        agreement: agreement._id,
        property: property._id,
        tenant: tenantId,
        owner: req.user._id,
        month: rentMonth,
        year: rentYear,
        amount: agreement.monthlyRent,
        dueDate: rentDueDate,
        status: i === 0 ? 'paid' : 'pending', // Assume first month is paid or marked
        paidDate: i === 0 ? new Date() : null,
      }).catch(() => {}); // ignore duplicates if any
    }

    await logAudit({
      user: req.user,
      action: 'AGREEMENT_CREATED',
      entity: 'Agreement',
      entityId: agreement._id,
      description: `Owner ${req.user.name} created lease agreement #${agreement.agreementNumber} for property "${property.title}"`,
      req,
    });

    // Notify tenant
    await createNotification({
      recipient: tenantId,
      sender: req.user._id,
      title: 'Lease Agreement Generated 📄',
      message: `Your lease agreement for "${property.title}" is ready. You can review terms and download your signed copy anytime.`,
      type: 'agreement',
      link: '/tenant/agreement',
    });

    const populatedAgreement = await Agreement.findById(agreement._id)
      .populate('property')
      .populate('tenant', 'name email phone address')
      .populate('owner', 'name email phone address');

    res.status(201).json({
      success: true,
      message: 'Rental agreement created and active!',
      data: populatedAgreement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agreements for logged-in user
// @route   GET /api/agreements
// @access  Private (Owner, Tenant, Admin)
const getAgreements = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === 'owner') {
      query.owner = req.user._id;
    } else if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    }
    // Admin sees all

    const agreements = await Agreement.find(query)
      .populate('property')
      .populate('tenant', 'name email phone profileImage address')
      .populate('owner', 'name email phone profileImage address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: agreements.length,
      data: agreements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single agreement by ID
// @route   GET /api/agreements/:id
// @access  Private
const getAgreementById = async (req, res, next) => {
  try {
    const agreement = await Agreement.findById(req.params.id)
      .populate('property')
      .populate('tenant', 'name email phone profileImage address')
      .populate('owner', 'name email phone profileImage address');

    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    const isOwner = agreement.owner._id.toString() === req.user._id.toString();
    const isTenant = agreement.tenant._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isTenant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this agreement.',
      });
    }

    res.status(200).json({
      success: true,
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sign agreement digitally (Tenant countersign)
// @route   PATCH /api/agreements/:id/sign
// @access  Tenant
const signAgreement = async (req, res, next) => {
  try {
    const agreement = await Agreement.findById(req.params.id);

    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    if (agreement.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the designated tenant can sign this agreement.',
      });
    }

    agreement.tenantSignature = {
      signed: true,
      signedAt: new Date(),
      signedBy: req.user.name,
    };

    await agreement.save();

    await logAudit({
      user: req.user,
      action: 'AGREEMENT_SIGNED',
      entity: 'Agreement',
      entityId: agreement._id,
      description: `Tenant ${req.user.name} digitally signed lease agreement #${agreement.agreementNumber}`,
      req,
    });

    await createNotification({
      recipient: agreement.owner,
      sender: req.user._id,
      title: 'Agreement Signed by Tenant ✍️',
      message: `${req.user.name} has digitally acknowledged and signed Agreement #${agreement.agreementNumber}.`,
      type: 'agreement',
      link: '/owner/agreements',
    });

    res.status(200).json({
      success: true,
      message: 'Agreement signed successfully',
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update agreement status (terminate/expire)
// @route   PATCH /api/agreements/:id/status
// @access  Owner or Admin
const updateAgreementStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const agreement = await Agreement.findById(req.params.id);

    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    const isOwner = agreement.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner or admin can update agreement status.',
      });
    }

    agreement.status = status;
    await agreement.save();

    // If agreement terminated, set property back to available
    if (status === 'terminated' || status === 'expired') {
      await Property.findByIdAndUpdate(agreement.property, { availabilityStatus: 'available' });
    }

    res.status(200).json({
      success: true,
      message: `Agreement status updated to ${status}`,
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAgreement,
  getAgreements,
  getAgreementById,
  signAgreement,
  updateAgreementStatus,
};
