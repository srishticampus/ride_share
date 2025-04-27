// server/src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
const { verify } = jwt;
import { JWT_SECRET } from '../config/env.config.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { User, Admin, Driver } from '../models/index.js';

/**
 * @description Authentication middleware to protect routes
 * @returns {Function} Middleware function
 */
// In auth.middleware.js
export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from header or cookie
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    // Remove any quotes that might be around the token
    token = req.headers.authorization.split(' ')[1].replace(/"/g, '');
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify token
  const decoded = verify(token, JWT_SECRET);

  // 3) Check user role and authenticate accordingly
  switch (decoded.role) {
    case 'admin':
      await handleAdminAuth(decoded, req, next);
      break;
    case 'driver':
      await handleDriverAuth(decoded, req, next);
      break;
    default:
      await handleUserAuth(decoded, req, next);
  }
});
// Helper function for admin authentication
const handleAdminAuth = async (decoded, req, next) => {
  if (decoded.id === 'admin') {
    req.user = { 
      id: 'admin', 
      role: 'admin',
      isAdmin: true
    };
    return next();
  }

  const currentAdmin = await Admin.findById(decoded.id);
  if (!currentAdmin) {
    return next(
      new AppError('The admin belonging to this token does no longer exist.', 401)
    );
  }

  req.user = {
    id: currentAdmin._id,
    role: 'admin',
    isAdmin: true,
    ...currentAdmin.toObject()
  };
  next();
};

// Helper function for driver authentication
// server/src/middlewares/auth.middleware.js
// server/src/middlewares/auth.middleware.js

const handleDriverAuth = async (decoded, req, next) => {
  try {
    const currentDriver = await Driver.findById(decoded.id);
    if (!currentDriver) {
      return next(
        new AppError('The driver belonging to this token does no longer exist.', 401)
      );
    }

    // Check if driver is approved and active
    if (!currentDriver.backgroundCheck) {
      return next(
        new AppError('Your account is pending approval.', 403)
      );
    }

    if (!currentDriver.status) {
      return next(
        new AppError('Your account has been deactivated.', 403)
      );
    }

    // Make sure to properly attach the user object
    req.user = {
      id: currentDriver._id,
      role: currentDriver.role || 'driver',      
      isDriver: true,
      isAdmin: false,
      isUser:false,
      ...currentDriver.toObject()
    };
    next();
  } catch (error) {
    next(error);
  }
};const handleUserAuth = async (decoded, req, next) => {
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist.', 401)
    );
  }

  req.user = {
    id: currentUser._id,
    role: currentUser.role || 'user',
    isAdmin: false,
    isDriver: false,
    ...currentUser.toObject()
  };
  next();
};

/**
 * @description Restrict access to certain roles
 * @param {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

/**
 * @description Middleware to check if user is authenticated (without throwing error)
 * @returns {Function} Middleware function
 */
export const optionalAuth = catchAsync(async (req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = verify(token, JWT_SECRET);
      
      switch (decoded.role) {
        case 'admin':
          if (decoded.id === 'admin') {
            req.user = { id: 'admin', role: 'admin', isAdmin: true };
          } else {
            const admin = await Admin.findById(decoded.id);
            if (admin) req.user = { ...admin.toObject(), isAdmin: true };
          }
          break;
        case 'driver':
          const driver = await Driver.findById(decoded.id);
          if (driver) req.user = { ...driver.toObject(), isDriver: true };
          break;
        default:
          const user = await User.findById(decoded.id);
          if (user) req.user = { ...user.toObject(), isAdmin: false, isDriver: false };
      }
    } catch (err) {
      // Token is invalid but we don't throw error for optional auth
    }
  }
  next();
});