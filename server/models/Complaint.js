const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      default: () => 'CMP-' + Math.floor(10000 + Math.random() * 90000),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    againstUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    title: {
      type: String,
      required: [true, 'Please provide complaint title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide complaint description'],
    },
    category: {
      type: String,
      enum: ['Property Issue', 'Owner Conduct', 'Tenant Conduct', 'Payment Dispute', 'Platform Issue', 'Other'],
      default: 'Property Issue',
    },
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'closed'],
      default: 'open',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    resolution: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
