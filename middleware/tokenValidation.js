import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECREAT || 'kajkhoj_super_secret_jwt_key_2026_wt_project_semester_security';

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization required. Please provide a Bearer token.',
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format. Expected "Bearer <token>".',
      });
    }

    const token = parts[1];
    if (!token || token === 'undefined' || token === 'null') {
      return res.status(401).json({
        success: false,
        message: 'No token found in authorization header. Please login again.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token. Access denied.',
    });
  }
};

export default validateToken;