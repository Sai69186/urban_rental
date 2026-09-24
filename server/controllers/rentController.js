const Rent = require('../models/Rent');
const Agreement = require('../models/Agreement');
const logAudit = require('../utils/auditLogger');
const createNotification = require('../utils/notify');

// @desc    Get rent records for user (Tenant, Owner, Admin)
// @route   GET /api/rents
// @access  Private
const getRentRecords = async (req, res, next) => {
  try {
    const { status, year, agreementId } = req.query;
    const query = {};

    if (req.user.role === 'owner') {
      query.owner = req.user._id;
    } else if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (year) {
      query.year = Number(year);
    }

    if (agreementId) {
      query.agreement = agreementId;
    }

    const rents = await Rent.find(query)
      .populate('property', 'title address city rent')
      .populate('tenant', 'name email phone profileImage')
      .populate('owner', 'name email phone')
      .populate('agreement', 'agreementNumber monthlyRent')
      .sort({ year: -1, dueDate: -1 });

    res.status(200).json({
      success: true,
      count: rents.length,
      data: rents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate rent invoice for a specific month & year
// @route   POST /api/rents/generate
// @access  Owner or Admin
const generateRentInvoice = async (req, res, next) => {
  try {
    const { agreementId, month, year, amount, lateFee, notes } = req.body;

    const agreement = await Agreement.findById(agreementId).populate('property');
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    if (agreement.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to bill rent for this agreement.',
      });
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = months.indexOf(month);
    const dueDate = new Date(year, monthIndex !== -1 ? monthIndex : new Date().getMonth(), agreement.dueDate || 5);

    const rent = await Rent.create({
      agreement: agreement._id,
      property: agreement.property._id,
      tenant: agreement.tenant,
      owner: req.user._id,
      month,
      year: Number(year),
      amount: Number(amount) || agreement.monthlyRent,
      dueDate,
      lateFee: Number(lateFee) || 0,
      notes: notes || '',
      status: 'pending',
    });

    await logAudit({
      user: req.user,
      action: 'RENT_INVOICE_GENERATED',
      entity: 'Rent',
      entityId: rent._id,
      description: `Owner ${req.user.name} generated rent invoice for ${month} ${year} (₹${rent.amount})`,
      req,
    });

    await createNotification({
      recipient: agreement.tenant,
      sender: req.user._id,
      title: `Rent Due for ${month} ${year} 💳`,
      message: `Rent invoice of ₹${rent.amount} for "${agreement.property?.title}" has been issued. Due by ${dueDate.toLocaleDateString()}.`,
      type: 'rent',
      link: '/tenant/rent',
    });

    res.status(201).json({
      success: true,
      message: `Rent invoice for ${month} ${year} created successfully`,
      data: rent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rent analytics summary
// @route   GET /api/rents/summary
// @access  Private
const getRentSummary = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role === 'owner') query.owner = req.user._id;
    if (req.user.role === 'tenant') query.tenant = req.user._id;

    const rents = await Rent.find(query);

    let totalRent = 0;
    let paidRent = 0;
    let pendingRent = 0;
    let overdueRent = 0;

    const now = new Date();

    rents.forEach((r) => {
      const amt = r.amount + (r.lateFee || 0);
      totalRent += amt;

      if (r.status === 'paid') {
        paidRent += amt;
      } else {
        if (new Date(r.dueDate) < now) {
          overdueRent += amt;
        } else {
          pendingRent += amt;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalRent,
        paidRent,
        pendingRent,
        overdueRent,
        totalRecords: rents.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRentRecords,
  generateRentInvoice,
  getRentSummary,
};
