const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Property = require('../models/Property');
const logAudit = require('../utils/auditLogger');
const createNotification = require('../utils/notify');

// @desc    Submit a new complaint or issue report
// @route   POST /api/complaints
// @access  Private (Tenant, Owner)
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, againstUserId, propertyId } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complaint title and detailed description.',
      });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      againstUser: againstUserId || null,
      property: propertyId || null,
      title,
      description,
      category: category || 'Property Issue',
      status: 'open',
    });

    await logAudit({
      user: req.user,
      action: 'COMPLAINT_FILED',
      entity: 'Complaint',
      entityId: complaint._id,
      description: `${req.user.name} filed complaint ticket #${complaint.ticketId}: "${title}"`,
      req,
    });

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification({
        recipient: admin._id,
        sender: req.user._id,
        title: `New Support / Dispute Complaint (#${complaint.ticketId}) ⚠️`,
        message: `${req.user.name} reported: "${title}" [Category: ${complaint.category}]. Action required.`,
        type: 'complaint',
        link: '/admin/complaints',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted. The administration team will review and investigate.',
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints list
// @route   GET /api/complaints
// @access  Private (Admin sees all, Users see their own)
const getComplaints = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const query = {};

    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name email phone role profileImage')
      .populate('againstUser', 'name email phone role')
      .populate('property', 'title address city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status & resolution
// @route   PATCH /api/complaints/:id/status
// @access  Admin Only
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, resolution } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate('user');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (adminNotes !== undefined) complaint.adminNotes = adminNotes;
    if (resolution !== undefined) complaint.resolution = resolution;

    await complaint.save();

    await logAudit({
      user: req.user,
      action: 'COMPLAINT_UPDATED',
      entity: 'Complaint',
      entityId: complaint._id,
      description: `Admin ${req.user.name} updated complaint #${complaint.ticketId} to '${status}'`,
      req,
    });

    // Notify complaining user
    await createNotification({
      recipient: complaint.user._id,
      sender: req.user._id,
      title: `Update on Complaint #${complaint.ticketId} ⚖️`,
      message: `Status: ${status.toUpperCase()}. Resolution/Notes: ${resolution || adminNotes || 'Under administrative review.'}`,
      type: 'complaint',
      link: complaint.user.role === 'owner' ? '/owner/dashboard' : '/tenant/complaints',
    });

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}`,
      data: complaint,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
};
