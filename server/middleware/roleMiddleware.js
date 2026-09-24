const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before role verification.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource. Required roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

const adminOnly = authorizeRoles('admin');
const ownerOnly = authorizeRoles('owner');
const tenantOnly = authorizeRoles('tenant');
const adminOrOwner = authorizeRoles('admin', 'owner');
const allRoles = authorizeRoles('admin', 'owner', 'tenant');

module.exports = {
  authorizeRoles,
  adminOnly,
  ownerOnly,
  tenantOnly,
  adminOrOwner,
  allRoles,
};
