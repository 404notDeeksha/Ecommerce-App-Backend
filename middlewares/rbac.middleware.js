const ROLES = {
  admin: ["product:create", "product:read", "product:update", "product:delete"],
  product_manager: ["product:create", "product:read", "product:update"],
  user: ["product:read"],
};

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not authenticated.",
      });
    }

    const userRole = req.user.role;
    const permissions = ROLES[userRole];

    if (!permissions) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Invalid role.",
      });
    }

    if (!permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${requiredPermission}`,
      });
    }

    next();
  };
};

module.exports = { checkPermission, ROLES };