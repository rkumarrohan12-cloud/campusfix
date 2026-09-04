const jwt = require('jsonwebtoken');

/**
 * verifyToken() - any logged-in user
 * verifyToken('student') - only students
 * verifyToken(['staff', 'hod']) - staff or hod
 */
function verifyToken(allowedRoles) {
  const roles = Array.isArray(allowedRoles)
    ? allowedRoles
    : allowedRoles
    ? [allowedRoles]
    : null;

  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    const token = header.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (roles && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'Forbidden for this role' });
      }
      req.user = payload;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

module.exports = { verifyToken };
