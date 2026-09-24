const User = require('../models/User');
const logAudit = require('../utils/auditLogger');
const createNotification = require('../utils/notify');

// @desc    Get all users (with filters & search)
// @route   GET /api/users
// @access  Admin Only
const getUsers = async (req, res, next) => {
  try {
    const { role, isVerified, isActive, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role && ['admin', 'owner', 'tenant'].includes(role)) {
      query.role = role;
    }

    if (isVerified !== undefined && isVerified !== '') {
      query.isVerified = isVerified === 'true';
    }

    if (isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (suspend/activate)
// @route   PATCH /api/users/:id/status
// @access  Admin Only
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot suspend their own active account.',
      });
    }

    user.isActive = Boolean(isActive);
    await user.save();

    await logAudit({
      user: req.user,
      action: user.isActive ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
      entity: 'User',
      entityId: user._id,
      description: `Admin ${req.user.name} ${user.isActive ? 'activated' : 'suspended'} user ${user.name} (${user.email})`,
      req,
    });

    await createNotification({
      recipient: user._id,
      sender: req.user._id,
      title: user.isActive ? 'Account Activated ✅' : 'Account Suspended ⚠️',
      message: user.isActive
        ? 'Your account has been reactivated by the administrator.'
        : 'Your account has been suspended by the administrator. Contact support for assistance.',
      type: 'system',
    });

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'suspended'} successfully`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user account (e.g. Owner identity proof)
// @route   PATCH /api/users/:id/verify
// @access  Admin Only
const verifyUser = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = Boolean(isVerified);
    await user.save();

    await logAudit({
      user: req.user,
      action: user.isVerified ? 'USER_VERIFIED' : 'USER_UNVERIFIED',
      entity: 'User',
      entityId: user._id,
      description: `Admin ${req.user.name} set verification to ${user.isVerified} for user ${user.name}`,
      req,
    });

    await createNotification({
      recipient: user._id,
      sender: req.user._id,
      title: user.isVerified ? 'Profile Verified 🎉' : 'Verification Revoked',
      message: user.isVerified
        ? 'Congratulations! Your account profile has been officially verified by the platform administration.'
        : 'Your verified status was removed by the administrator.',
      type: 'system',
    });

    res.status(200).json({
      success: true,
      message: `User verification status updated to ${user.isVerified}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin Only
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user.' });
    }

    await User.findByIdAndDelete(req.params.id);

    await logAudit({
      user: req.user,
      action: 'USER_DELETED',
      entity: 'User',
      entityId: req.params.id,
      description: `Admin ${req.user.name} permanently removed user ${user.name} (${user.email})`,
      req,
    });

    res.status(200).json({
      success: true,
      message: 'User removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  verifyUser,
  deleteUser,
};
