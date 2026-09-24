const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      default: () => 'MNT-' + Math.floor(10000 + Math.random() * 90000),
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide issue title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe the maintenance issue'],
    },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Internet', 'Appliance', 'Structural', 'Cleaning', 'Other'],
      default: 'Plumbing',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Submitted', 'Acknowledged', 'In Progress', 'Resolved', 'Closed'],
      default: 'Submitted',
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    actualCost: {
      type: Number,
      default: 0,
    },
    ownerNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
