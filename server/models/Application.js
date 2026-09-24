const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
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
    moveInDate: {
      type: Date,
      required: [true, 'Please provide intended move-in date'],
    },
    employmentStatus: {
      type: String,
      required: [true, 'Please specify employment status'],
      enum: ['Employed', 'Self-Employed', 'Business Owner', 'Student', 'Other'],
      default: 'Employed',
    },
    monthlyIncome: {
      type: Number,
      required: [true, 'Please provide approximate monthly income'],
    },
    numberOfOccupants: {
      type: Number,
      required: [true, 'Please specify number of occupants'],
      min: [1, 'At least 1 occupant required'],
      default: 1,
    },
    message: {
      type: String,
      default: '',
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        fileType: { type: String, default: 'image' },
        status: {
          type: String,
          enum: ['pending', 'verified', 'rejected'],
          default: 'pending',
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    ownerNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ tenant: 1, property: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
