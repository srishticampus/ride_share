//server/src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
const { verify } = jwt;
import { JWT_SECRET } from '../config/env.config.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { User, Admin } from '../models/index.js';

/**
 * @description Authentication middleware to protect routes
 * @returns {Function} Middleware function
 */
export const protect = catchAsync(async (req, res, next) => {
  // 1) Get token from header or cookie
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
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

  // 3) Check if token is for admin or regular user
  if (decoded.role === 'admin') {
    // Handle admin authentication
    if (decoded.id === 'admin') {
      req.user = { 
        id: 'admin', 
        role: 'admin',
        isAdmin: true
      };
      return next();
    }

    // For database-stored admins
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
    return next();
  }

  // 4) Handle regular user authentication
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist.', 401)
    );
  }

  // 5) Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // 6) Grant access
  req.user = {
    id: currentUser._id,
    role: currentUser.role || 'user',
    isAdmin: false,
    ...currentUser.toObject()
  };
  next();
});

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
      
      if (decoded.role === 'admin') {
        if (decoded.id === 'admin') {
          req.user = { id: 'admin', role: 'admin', isAdmin: true };
        } else {
          const admin = await Admin.findById(decoded.id);
          if (admin) req.user = { ...admin.toObject(), isAdmin: true };
        }
      } else {
        const user = await User.findById(decoded.id);
        if (user) req.user = { ...user.toObject(), isAdmin: false };
      }
    } catch (err) {
      // Token is invalid but we don't throw error for optional auth
    }
  }
  next();
});