import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import AppError from '../utils/AppError.js';

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { id: decoded.id };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

export default authenticate;