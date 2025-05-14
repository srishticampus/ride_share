// server/src/middlewares/auth.middleware.js
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
    token = req.headers.authorization.split(' ')[1].replace(/"/g,'');
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt.replace(/"/g, '');  
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify token
  const decoded = verify(token, JWT_SECRET);
  console.log('Decoded token:', decoded);

  // 3) Determine user type by checking all models
  let currentUser = null;
  let userRole = null;

  // First check for admin
  if (decoded.id === 'admin') {
    currentUser = { id: 'admin' };
    userRole = ROLES.ADMIN;
  } else {
    // Check regular admin accounts
    currentUser = await Admin.findById(decoded.id);
    if (currentUser) userRole = ROLES.ADMIN;
  }

  // If not admin, check driver
  if (!currentUser) {
    currentUser = await Driver.findById(decoded.id);
    if (currentUser) userRole = ROLES.DRIVER;
  }

  // If not driver, check regular user
  if (!currentUser) {
    currentUser = await User.findById(decoded.id);
    if (currentUser) userRole = ROLES.USER;
  }

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Set user data based on type
  req.user = {
    id: currentUser._id || currentUser.id,
    role: userRole,
    isAdmin: userRole === ROLES.ADMIN,
    isDriver: userRole === ROLES.DRIVER,
    ...(currentUser.toObject ? currentUser.toObject() : {})
  };

  // 5) Additional role-specific checks
  if (userRole === ROLES.DRIVER) {
    if (!currentUser.status) {
      return next(
        new AppError('Your driver account has been deactivated. Please contact support.', 403)
      );
    }
    if (!currentUser.backgroundCheck) {
      return next(
        new AppError('Background check not completed. Please complete verification.', 403)
      );
    }
  }

  if (userRole === ROLES.USER && !currentUser.isVerified) {
    return next(
      new AppError('Your account is not verified. Please verify your email.', 403)
    );
  }

  next();
});

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
      
      // Determine user type by checking all models
      let currentUser = await Admin.findById(decoded.id);
      if (currentUser) {
        req.user = { ...currentUser.toObject(), isAdmin: true, role: ROLES.ADMIN };
      } else {
        currentUser = await Driver.findById(decoded.id);
        if (currentUser) {
          req.user = { ...currentUser.toObject(), isDriver: true, role: ROLES.DRIVER };
        } else {
          currentUser = await User.findById(decoded.id);
          if (currentUser) {
            req.user = { ...currentUser.toObject(), role: ROLES.USER };
          }
        }
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