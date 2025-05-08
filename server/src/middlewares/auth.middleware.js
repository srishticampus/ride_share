import jwt from 'jsonwebtoken';
const { verify } = jwt;
import { JWT_SECRET } from '../config/env.config.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { User, Admin, Driver } from '../models/index.js';

// Role constants for better maintainability
const ROLES = {
  ADMIN: 'admin',
  DRIVER: 'driver',
  USER: 'user'
};

/**
 * @description Authentication middleware to protect routes
 * @returns {Function} Middleware function
 */
export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from header or cookie
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(" ")[1].replace(/"/g,"");
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
    case ROLES.ADMIN:
      await handleAdminAuth(decoded, req, next);
      break;
    case ROLES.DRIVER:
      await handleDriverAuth(decoded, req, next);
      break;
    case ROLES.USER:
      await handleUserAuth(decoded, req, next);
      break;
    default:
      return next(
        new AppError('Invalid user role specified in token.', 401)
      );
  }
});

// Helper function for admin authentication
const handleAdminAuth = async (decoded, req, next) => {
  // Handle special admin case
  if (decoded.id === 'admin') {
    req.user = { 
      id: 'admin', 
      role: ROLES.ADMIN,
      isAdmin: true
    };
    return next();
  }

  // For database-stored admins
  const currentAdmin = await Admin.findById(decoded.id);
  if (!currentAdmin) {
    return next(
      new AppError('The admin belonging to this token no longer exists.', 401)
    );
  }

  req.user = {
    id: currentAdmin._id,
    role: ROLES.ADMIN,
    isAdmin: true,
    ...currentAdmin.toObject()
  };
  next();
};

// Helper function for driver authentication
const handleDriverAuth = async (decoded, req, next) => {
  const currentDriver = await Driver.findById(decoded.id)
    .select('+passwordChangedAt');
    
  if (!currentDriver) {
    return next(
      new AppError('The driver belonging to this token no longer exists.', 401)
    );
  }

  // Check if driver account is active
  if (!currentDriver.status) {
    return next(
      new AppError('Your driver account has been deactivated. Please contact support.', 403)
    );
  }

  // Check if background check is completed
  if (!currentDriver.backgroundCheck) {
    return next(
      new AppError('Background check not completed. Please complete verification.', 403)
    );
  }

  // Check if driver changed password after token was issued
  if (currentDriver.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Driver recently changed password! Please log in again.', 401)
    );
  }

  req.user = {
    id: currentDriver._id,
    role: ROLES.DRIVER,
    isDriver: true,
    isAdmin: false,
    ...currentDriver.toObject()
  };
  next();
};

// Helper function for regular user authentication
const handleUserAuth = async (decoded, req, next) => {
  const currentUser = await User.findById(decoded.id)
    .select('+passwordChangedAt');

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // Check if user is verified
  if (!currentUser.isVerified) {
    return next(
      new AppError('Your account is not verified. Please verify your email.', 403)
    );
  }

  req.user = {
    id: currentUser._id,
    role: ROLES.USER,
    isAdmin: false,
    isDriver: false,
    ...currentUser.toObject()
  };
  next();
};

/**
 * @description Restrict access to certain roles
 * @param {...String} roles - Allowed roles (admin, driver, user)
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

    // Additional role-specific checks
    if (req.user.role === ROLES.DRIVER && !req.user.status) {
      return next(
        new AppError('Your driver account is currently inactive', 403)
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
        case ROLES.ADMIN:
          if (decoded.id === 'admin') {
            req.user = { id: 'admin', role: ROLES.ADMIN, isAdmin: true };
          } else {
            const admin = await Admin.findById(decoded.id);
            if (admin) req.user = { ...admin.toObject(), isAdmin: true };
          }
          break;
        case ROLES.DRIVER:
          const driver = await Driver.findById(decoded.id);
          if (driver) req.user = { 
            ...driver.toObject(), 
            isDriver: true,
            role: ROLES.DRIVER
          };
          break;
        case ROLES.USER:
          const user = await User.findById(decoded.id);
          if (user) req.user = { 
            ...user.toObject(),
            role: ROLES.USER
          };
          break;
      }
    } catch (err) {
      // Token is invalid but we don't throw error for optional auth
    }
  }
  next();
});

/**
 * @description Middleware to verify driver-specific requirements
 * @returns {Function} Middleware function
 */
export const verifyDriver = catchAsync(async (req, res, next) => {
  if (req.user.role !== ROLES.DRIVER) {
    return next(
      new AppError('This route is restricted to drivers only', 403)
    );
  }

  // Check if driver has completed all requirements
  if (!req.user.backgroundCheck) {
    return next(
      new AppError('Please complete your background check before accessing this feature', 403)
    );
  }

  // Check if driver has a registered vehicle
  if (!req.user.vehicleId) {
    return next(
      new AppError('Please register your vehicle before accessing this feature', 403)
    );
  }

  next();
});