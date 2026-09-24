const User = require('../models/User');
const Property = require('../models/Property');
const Application = require('../models/Application');
const Agreement = require('../models/Agreement');
const Rent = require('../models/Rent');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');
const Complaint = require('../models/Complaint');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const logAudit = require('../utils/auditLogger');
const createNotification = require('../utils/notify');

// @desc    Get complete administrative dashboard analytics
// @route   GET /api/admin/dashboard-stats
// @access  Admin Only
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalTenants = await User.countDocuments({ role: 'tenant' });

    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ approvalStatus: 'approved' });
    const pendingProperties = await Property.countDocuments({ approvalStatus: 'pending' });
    const rentedProperties = await Property.countDocuments({ availabilityStatus: 'rented' });

    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    const activeAgreements = await Agreement.countDocuments({ status: 'active' });

    const totalMaintenance = await Maintenance.countDocuments();
    const pendingMaintenance = await Maintenance.countDocuments({ status: { $in: ['Submitted', 'Acknowledged', 'In Progress'] } });

    const openComplaints = await Complaint.countDocuments({ status: { $in: ['open', 'investigating'] } });

    // Financial summaries
    const payments = await Payment.find();
    const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    const rents = await Rent.find();
    const pendingRent = rents
      .filter((r) => r.status === 'pending' || r.status === 'overdue')
      .reduce((acc, r) => acc + (r.amount || 0), 0);

    // Breakdown: Properties by City
    const propertiesByCity = await Property.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Breakdown: Properties by Type
    const propertiesByType = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Breakdown: Maintenance by Category
    const maintenanceByCategory = await Maintenance.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalTenants,
        totalProperties,
        approvedProperties,
        pendingProperties,
        rentedProperties,
        totalApplications,
        pendingApplications,
        activeAgreements,
        totalMaintenance,
        pendingMaintenance,
        openComplaints,
        totalRevenue,
        pendingRent,
        propertiesByCity,
        propertiesByType,
        maintenanceByCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a property listing
// @route   PATCH /api/admin/properties/:id/approval
// @access  Admin Only
const setPropertyApproval = async (req, res, next) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;
    const property = await Property.findById(req.params.id).populate('owner');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (!['approved', 'rejected', 'pending'].includes(approvalStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid approval status' });
    }

    property.approvalStatus = approvalStatus;
    if (rejectionReason !== undefined) {
      property.rejectionReason = rejectionReason;
    }
    await property.save();

    await logAudit({
      user: req.user,
      action: `PROPERTY_${approvalStatus.toUpperCase()}`,
      entity: 'Property',
      entityId: property._id,
      description: `Admin ${req.user.name} marked property "${property.title}" as ${approvalStatus}`,
      req,
    });

    // Notify owner
    const msg = approvalStatus === 'approved'
      ? `Congratulations! Your property listing "${property.title}" has been reviewed and APPROVED. It is now live on the platform.`
      : `Your property listing "${property.title}" was not approved. Reason: ${rejectionReason || 'Please review guidelines and update.'}`;

    await createNotification({
      recipient: property.owner._id,
      sender: req.user._id,
      title: approvalStatus === 'approved' ? 'Listing Approved! 🌟' : 'Listing Status Update ⚠️',
      message: msg,
      type: 'property',
      link: '/owner/properties',
    });

    res.status(200).json({
      success: true,
      message: `Property ${approvalStatus} successfully`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (including pending / rejected) for admin
// @route   GET /api/admin/properties
// @access  Admin Only
const getAdminProperties = async (req, res, next) => {
  try {
    const { approvalStatus, city, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (approvalStatus && approvalStatus !== 'All') {
      query.approvalStatus = approvalStatus;
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone profileImage isVerified')
      .sort({ createdAt: -1 })
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

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Admin Only
const getAuditLogs = async (req, res, next) => {
  try {
    const { action, entity, page = 1, limit = 30 } = req.query;
    const query = {};

    if (action) query.action = { $regex: action, $options: 'i' };
    if (entity && entity !== 'All') query.entity = entity;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Broadcast system notification to all users or specific roles
// @route   POST /api/admin/broadcast
// @access  Admin Only
const broadcastNotification = async (req, res, next) => {
  try {
    const { targetRole, title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide notification title and message.',
      });
    }

    const userQuery = {};
    if (targetRole && ['owner', 'tenant'].includes(targetRole)) {
      userQuery.role = targetRole;
    }

    const users = await User.find(userQuery);

    for (const user of users) {
      await createNotification({
        recipient: user._id,
        sender: req.user._id,
        title: `📢 ${title}`,
        message,
        type: 'system',
      });
    }

    await logAudit({
      user: req.user,
      action: 'ADMIN_BROADCAST',
      entity: 'Notification',
      description: `Admin ${req.user.name} sent broadcast to ${targetRole || 'all users'} (${users.length} recipients)`,
      req,
    });

    res.status(200).json({
      success: true,
      message: `Broadcast delivered to ${users.length} users successfully!`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  setPropertyApproval,
  getAdminProperties,
  getAuditLogs,
  broadcastNotification,
};
