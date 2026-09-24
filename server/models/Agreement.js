const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema(
  {
    agreementNumber: {
      type: String,
      unique: true,
      default: () => 'AGR-' + Math.floor(100000 + Math.random() * 900000),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
    },
    dueDate: {
      type: Number,
      default: 5, // Day of the month rent is due (1-31)
      min: 1,
      max: 31,
    },
    terms: {
      type: String,
      default: '1. The Tenant shall pay the agreed monthly rent on or before the due date.\n2. The Tenant shall keep the premises in good and clean condition.\n3. The Tenant shall not sublet or assign the premises without written consent of the Owner.\n4. Standard notice period of 1 month required prior to vacating.\n5. Standard utilities (electricity, water) to be settled monthly as per actual consumption.',
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'expired', 'terminated'],
      default: 'active',
    },
    ownerSignature: {
      signed: { type: Boolean, default: true },
      signedAt: { type: Date, default: Date.now },
      signedBy: { type: String, default: 'Owner' },
    },
    tenantSignature: {
      signed: { type: Boolean, default: true },
      signedAt: { type: Date, default: Date.now },
      signedBy: { type: String, default: 'Tenant' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Agreement', agreementSchema);
