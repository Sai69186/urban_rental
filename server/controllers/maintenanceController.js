const Maintenance = require('../models/Maintenance');
const Property = require('../models/Property');
const Agreement = require('../models/Agreement');
const logAudit = require('../utils/auditLogger');
const createNotification = require('../utils/notify');

// @desc    Create a new maintenance request
// @route   POST /api/maintenance
// @access  Tenant
const createRequest = async (req, res, next) => {
  try {
    const { propertyId, title, description, category, priority, images } = req.body;

    if (!propertyId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide property, title, and description for maintenance request.',
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const maintenance = await Maintenance.create({
      tenant: req.user._id,
      property: propertyId,
      owner: property.owner,
      title,
      description,
      category: category || 'Plumbing',
      priority: priority || 'Medium',
      images: images || [],
      status: 'Submitted',
    });

    await logAudit({
      user: req.user,
      action: 'MAINTENANCE_CREATED',
      entity: 'Maintenance',
      entityId: maintenance._id,
      description: `Tenant ${req.user.name} raised ticket #${maintenance.ticketNumber}: "${title}" (${priority} priority)`,
      req,
    });

    // Notify owner
    await createNotification({
      recipient: property.owner,
      sender: req.user._id,
      title: `New Maintenance Ticket Raised 🔧 (#${maintenance.ticketNumber})`,
      message: `${req.user.name} reported: "${title}" [${category} - ${priority} Priority] at "${property.title}".`,
      type: 'maintenance',
      link: '/owner/maintenance',
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance ticket created successfully',
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get maintenance requests
// @route   GET /api/maintenance
// @access  Private (Tenant, Owner, Admin)
const getMaintenanceRequests = async (req, res, next) => {
  try {
    const { status, priority, category } = req.query;
    const query = {};

    if (req.user.role === 'owner') {
      query.owner = req.user._id;
    } else if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const requests = await Maintenance.find(query)
      .populate('property', 'title address city')
      .populate('tenant', 'name email phone profileImage')
      .populate('owner', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance request status & notes
// @route   PATCH /api/maintenance/:id/status
// @access  Owner or Admin
const updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { status, estimatedCost, actualCost, ownerNotes } = req.body;
    const maintenance = await Maintenance.findById(req.params.id).populate('property');

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance ticket not found' });
    }

    const isOwner = maintenance.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this ticket.',
      });
    }

    if (status) {
      maintenance.status = status;
      if (status === 'Resolved' || status === 'Closed') {
        maintenance.resolvedAt = new Date();
      }
    }

    if (estimatedCost !== undefined) maintenance.estimatedCost = Number(estimatedCost);
    if (actualCost !== undefined) maintenance.actualCost = Number(actualCost);
    if (ownerNotes !== undefined) maintenance.ownerNotes = ownerNotes;

    await maintenance.save();

    await logAudit({
      user: req.user,
      action: 'MAINTENANCE_UPDATED',
      entity: 'Maintenance',
      entityId: maintenance._id,
      description: `${req.user.name} updated ticket #${maintenance.ticketNumber} to status '${status}'`,
      req,
    });

    // Notify tenant
    await createNotification({
      recipient: maintenance.tenant,
      sender: req.user._id,
      title: `Maintenance Ticket #${maintenance.ticketNumber} Update 🛠️`,
      message: `Status is now '${status}'. Note: ${ownerNotes || 'Status updated by owner/admin.'}`,
      type: 'maintenance',
      link: '/tenant/maintenance',
    });

    res.status(200).json({
      success: true,
      message: `Maintenance ticket updated to ${status}`,
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tenant confirms resolution / closes ticket
// @route   PATCH /api/maintenance/:id/confirm
// @access  Tenant
const confirmResolution = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ success: false, message: 'Maintenance ticket not found' });
    }

    if (maintenance.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the tenant who created this ticket can close it.',
      });
    }

    maintenance.status = 'Closed';
    await maintenance.save();

    await logAudit({
      user: req.user,
      action: 'MAINTENANCE_CLOSED',
      entity: 'Maintenance',
      entityId: maintenance._id,
      description: `Tenant ${req.user.name} confirmed resolution and closed ticket #${maintenance.ticketNumber}`,
      req,
    });

    await createNotification({
      recipient: maintenance.owner,
      sender: req.user._id,
      title: `Maintenance Ticket #${maintenance.ticketNumber} Closed ✅`,
      message: `Tenant ${req.user.name} has verified the fix and closed the ticket.`,
      type: 'maintenance',
      link: '/owner/maintenance',
    });

    res.status(200).json({
      success: true,
      message: 'Ticket closed successfully',
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getMaintenanceRequests,
  updateMaintenanceStatus,
  confirmResolution,
};
