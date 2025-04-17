//server/src/controllers/admin.controller.js
import {Admin} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { signToken } from '../utils/jwt.js';
import { loginSchema } from '../validations/admin.validation.js';
/**
 * @description Admin login
 * @route POST /api/loginAdmin
 * @access Public
 */


export const login = catchAsync(async (req, res, next) => {
  // Hardcoded admin credentials (consider moving to config)
  if (req.body.email === "admin@gmail.com" && req.body.password === "admin@123") {
    const token = signToken('admin', 'admin'); // Add role as second parameter
    return res.status(200).json({
      status: 'success',
      token,
      data: { 
        admin: { 
          email: "admin@gmail.com",
          role: "admin"
        } 
      }
    });
  }

  const admin = await Admin.findOne({ email: req.body.email }).select('+password');
  
  if (!admin || !(await admin.correctPassword(req.body.password, admin.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(admin._id, admin.role);
  
  res.status(200).json({
    status: 'success',
    token,
    data: { admin }
  });
});

export default { login };