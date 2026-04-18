const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: `Only ${allowedRoles.join(', ')} can access this route` });
    }
    next();
  };
};

module.exports = authorizeRoles;