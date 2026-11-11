import jwt from 'jsonwebtoken';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECREAT || 'kajkhoj_super_secret_jwt_key_2026_wt_project_semester_security';

// Verifies the Bearer token AND that its account still exists, then runs `next`.
// Callers must have connected to the database first (every route calls ConnectDB).
const validateToken = async (req, res, next) => {
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

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === 'TokenExpiredError'
          ? 'Your session has expired. Please log in again.'
          : 'Invalid or malformed authentication token. Access denied.',
    });
  }

  try {
    // A token outlives a deleted account; don't let it keep acting as that user.
    const exists = await User.exists({ _id: decoded.id });
    if (!exists) {
      return res.status(401).json({
        success: false,
        message: 'This account no longer exists. Please log in again.',
      });
    }
  } catch (error) {
    console.error('Error checking token owner (server):', error);
    return res.status(500).json({
      success: false,
      message: 'Could not verify your session due to a server error.',
    });
  }

  req.user = decoded;
  return next();
};

export default validateToken;
