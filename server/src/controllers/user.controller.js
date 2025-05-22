// server/src/controllers/user.controller.js
import {User} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { createSendToken } from '../utils/jwt.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Configure multer storage with better file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/users';
    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `user-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

// File upload middleware with limits and filtering
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
}).single('profilePicture');

// Helper function to clean up user data for responses
const filterUserData = (user) => {
  const filteredUser = user.toObject();
  delete filteredUser.password;
  delete filteredUser.__v;
  return filteredUser;
};

// User registration (without transactions)
export const registerUser = catchAsync(async (req, res, next) => {
  try {
    const { email, password, fullName, phoneNumber ,address , emergencyNo} = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      return next(new AppError('User with this email or phone number already exists', 400));
    }

    // Handle file upload
    let profilePicturePath;
    if (req.file) {
      profilePicturePath = `uploads/users/${req.file.filename}`;
    }

    // Create user
    const newUser = await User.create({
      email,
      fullName,
      emergencyNo,
      phoneNumber,
      password,
      address,
      profilePicture: profilePicturePath
    });

    // Send response
    createSendToken(newUser, 201, res);

  } catch (err) {
    // Clean up uploaded file if an error occurs
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('File cleanup failed:', unlinkErr);
      }
    }

    console.error('Registration Error:', err);
    return next(new AppError('User registration failed. Please try again.', 500));
  }
});

// User login
export const loginUser = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  // 1) Check if phoneNumber and password exist
  if (!phoneNumber || !password) {
    return next(new AppError('Please provide phone number and password', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ phoneNumber }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect phone number or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});
export const FindByPhonenumber = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new AppError('Phone number is required!', 400));
  }

  const user = await User.findOne({ phoneNumber }).select('-password -__v');

  if (!user) {
    return next(new AppError('No driver found with this phone number.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user, 
  });
});
// Forgot password (without transactions)
export const ForgotPassword = catchAsync(async (req, res, next) => {
  const phoneNumber = decodeURIComponent(req.params.phoneNumber);
  const { password } = req.body;

  if (!phoneNumber) {
    return next(new AppError('Phone number is required', 400));
  }

  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new AppError('No user found with this phone number', 404));
  }

  user.password = password;
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
// Update profile with file handling (without transactions)
export const updateProfile = catchAsync(async (req, res, next) => {
  // Debug: Log incoming data
  console.log('Received data:', req.body);
  console.log('Received file:', req.file);

  if (req.body.password) {
    return next(new AppError('This route is not for password updates', 400));
  }

  const filteredBody = {
    email: req.body.email,
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    emergencyNo: req.body.emergencyNo,
    address: req.body.address
  };

  // Validate email format
  if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
    return next(new AppError('Please provide a valid email address', 400));
  }

  // Check if email is being changed
  if (req.body.email) {
    const existingUserWithEmail = await User.findOne({ 
      email: req.body.email,
      _id: { $ne: req.user.id }
    });
    
    if (existingUserWithEmail) {
      return next(new AppError('This email is already registered', 400));
    }
  }

  // Check if phone number is being changed
  if (req.body.phoneNumber) {
    const existingUserWithPhone = await User.findOne({ 
      phoneNumber: req.body.phoneNumber,
      _id: { $ne: req.user.id }
    });
    
    if (existingUserWithPhone) {
      return next(new AppError('This phone number is already registered', 400));
    }
  }

  // Handle file upload
  if (req.file) {
    const user = await User.findById(req.user.id);
    
    // Delete old profile picture if exists
    // if (user.profilePicture) {
    //   const oldFilePath = path.join(__dirname, '..', '..', 'public', user.profilePicture);
    //   if (fs.existsSync(oldFilePath)) {
    //     fs.unlinkSync(oldFilePath);
    //   }
    // }
    
    filteredBody.profilePicture = `uploads/users/${req.file.filename}`;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    ).select('-password -__v');

    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    console.log('Updated user:', updatedUser); // Debug

    res.status(200).json({
      status: 'success',
      data: {
        user: filterUserData(updatedUser)
      }
    });
  } catch (err) {
    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      let errorMessage = 'This value is already registered';
      
      if (field === 'email') errorMessage = 'This email is already registered';
      if (field === 'phoneNumber') errorMessage = 'This phone number is already registered';
      
      return next(new AppError(errorMessage, 400));
    }
    return next(err);
  }
});// Get all users (admin only) with pagination
export const getAllUsers = catchAsync(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .select('-password -__v');

  const totalUsers = await User.countDocuments();

  res.status(200).json({
    status: 'success',
    results: users.length,
    total: totalUsers,
    page,
    pages: Math.ceil(totalUsers / limit),
    data: {
      users
    }
  });
});

// Get single user (admin only)
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password -__v');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// Get current user profile
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password -__v');
  
  if (!user) {
    return next(new AppError('No user found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export default {
  registerUser,
  loginUser,
  FindByPhonenumber,
  ForgotPassword,
  updateProfile,
  getAllUsers,
  getUser,
  getMe,
  upload
};