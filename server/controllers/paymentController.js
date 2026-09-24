const Payment = require('../models/Payment');
const Rent = require('../models/Rent');
const Agreement = require('../models/Agreement');
const logAudit = require('../utils/auditLogger');
const createNotification = require('../utils/notify');

// @desc    Record rent payment (Tenant pays or Owner records manual offline payment)
// @route   POST /api/payments
// @access  Private (Tenant, Owner, Admin)
const recordPayment = async (req, res, next) => {
  try {
    const {
      rentId,
      agreementId,
      amount,
      paymentMethod,
      transactionReference,
      notes,
    } = req.body;

    let agreement;
    let rentRecord;

    if (rentId) {
      rentRecord = await Rent.findById(rentId).populate('property');
      if (!rentRecord) {
        return res.status(404).json({ success: false, message: 'Rent record not found' });
      }
      agreement = await Agreement.findById(rentRecord.agreement);
    } else if (agreementId) {
      agreement = await Agreement.findById(agreementId).populate('property');
      if (!agreement) {
        return res.status(404).json({ success: false, message: 'Agreement not found' });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide either rentId or agreementId.',
      });
    }

    const payAmount = Number(amount) || (rentRecord ? (rentRecord.amount + (rentRecord.lateFee || 0)) : agreement.monthlyRent);

    const payment = await Payment.create({
      rentRecord: rentRecord ? rentRecord._id : null,
      agreement: agreement._id,
      property: agreement.property._id || agreement.property,
      tenant: agreement.tenant,
      owner: agreement.owner,
      amount: payAmount,
      paymentDate: new Date(),
      paymentMethod: paymentMethod || 'UPI',
      transactionReference: transactionReference || 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'completed',
      notes: notes || `Rent payment for ${rentRecord ? `${rentRecord.month} ${rentRecord.year}` : 'lease agreement'}`,
    });

    // Mark rent record as paid if linked
    if (rentRecord) {
      rentRecord.status = 'paid';
      rentRecord.paidDate = new Date();
      await rentRecord.save();
    }

    await logAudit({
      user: req.user,
      action: 'PAYMENT_RECORDED',
      entity: 'Payment',
      entityId: payment._id,
      description: `Payment of ₹${payment.amount} recorded via ${payment.paymentMethod} (Ref: ${payment.transactionReference})`,
      req,
    });

    // Notify recipient
    const isTenantPaying = req.user._id.toString() === agreement.tenant.toString();
    const notifyTarget = isTenantPaying ? agreement.owner : agreement.tenant;
    const notifyTitle = isTenantPaying ? 'Rent Payment Received 💰' : 'Rent Payment Recorded 🧾';
    const notifyMsg = isTenantPaying
      ? `Tenant ${req.user.name} submitted rent payment of ₹${payment.amount} via ${payment.paymentMethod}.`
      : `Owner recorded your rent payment of ₹${payment.amount} via ${payment.paymentMethod}.`;

    await createNotification({
      recipient: notifyTarget,
      sender: req.user._id,
      title: notifyTitle,
      message: notifyMsg,
      type: 'payment',
      link: isTenantPaying ? '/owner/payments' : '/tenant/payments',
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully!',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment transactions ledger
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const query = {};

    if (req.user.role === 'owner') {
      query.owner = req.user._id;
    } else if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    }
    // Admin sees all

    const payments = await Payment.find(query)
      .populate('property', 'title address city rent')
      .populate('tenant', 'name email phone')
      .populate('owner', 'name email phone')
      .populate('rentRecord', 'month year amount')
      .populate('agreement', 'agreementNumber')
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('property')
      .populate('tenant', 'name email phone address')
      .populate('owner', 'name email phone address')
      .populate('rentRecord')
      .populate('agreement');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordPayment,
  getPayments,
  getPaymentById,
};
