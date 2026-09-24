const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide property title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide property description'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['Apartment', 'House', 'Villa', 'Room', 'Studio', 'PG', 'Other'],
      default: 'Apartment',
    },
    address: {
      type: String,
      required: [true, 'Please provide street address'],
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Please provide postal code / pincode'],
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    rent: {
      type: Number,
      required: [true, 'Please provide monthly rent amount'],
      min: [0, 'Rent must be positive'],
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Please provide security deposit amount'],
      min: [0, 'Deposit must be positive'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please provide number of bedrooms'],
      min: [0, 'Bedrooms must be 0 or more'],
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please provide number of bathrooms'],
      min: [0, 'Bathrooms must be 0 or more'],
      default: 1,
    },
    area: {
      type: Number,
      required: [true, 'Please provide carpet/built-up area in sq ft'],
      min: [1, 'Area must be positive'],
    },
    furnishingStatus: {
      type: String,
      enum: ['Fully-Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Semi-Furnished',
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    availabilityStatus: {
      type: String,
      enum: ['available', 'under_application', 'rented', 'maintenance'],
      default: 'available',
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for fast search & filtering
propertySchema.index({ city: 1, propertyType: 1, rent: 1, approvalStatus: 1, availabilityStatus: 1 });
propertySchema.index({ title: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('Property', propertySchema);
