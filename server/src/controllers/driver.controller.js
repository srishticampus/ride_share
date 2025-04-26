//server/src/controllers/driver.controller.js
import {Driver} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { signToken } from '../utils/jwt.js';

export const DriverRegistration = catchAsync(async (req, res, next) => {
  const {email,vehicleRegNumber ,phoneNumber, password, licenseNumber, fullname } = req.body;
  
  const newDriver = await Driver.create({
    email,
    vehicleRegNumber,
    phoneNumber,
    password,
    licenseNumber,
    fullname,
    driverPic: req.file ? req.file.filename : undefined
  });

  const token = signToken(newDriver._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      driver: newDriver
    }
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  const driver = await Driver.findOne({ phoneNumber }).select('+password');
  if (!driver) {
    return next(new AppError('User not found', 404));
  }

  if (!(await driver.correctPassword(password, driver.password))) {
    return next(new AppError('Password Mismatch', 403));
  }

  if (!driver.backgroundCheck) {
    return next(new AppError('Please wait for Admin Approval', 403));
  }

  if (!driver.status) {
    return next(new AppError('You are currently deactivated By Admin', 403));
  }

  const token = signToken(driver._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      driver
    }
  });
});

export const EditProfile = catchAsync(async (req, res, next) => {
  const data = {
    phoneNumber: req.body.phoneNumber,
    licenseNumber: req.body.licenseNumber,
    fullname: req.body.fullname
  };

  if (req.file) {
    data.driverPic = req.file.filename;
  }

  const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true
  });

  if (!updatedDriver) {
    return next(new AppError('No driver found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      driver: updatedDriver
    }
  });
});

export const FindByPhonenumber = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new AppError('Phone number is required!', 400));
  }

  const driver = await Driver.findOne({ phoneNumber }).select('-password -__v');

  if (!driver) {
    return next(new AppError('No driver found with this phone number.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: driver, 
  });
});
export const ForgotPassword = catchAsync(async (req, res, next) => {
  const phoneNumber = decodeURIComponent(req.params.phoneNumber);
  const { password } = req.body;

  if (!phoneNumber) {
    return next(new AppError('Phone number is required', 400));
  }

  const driver = await Driver.findOne({ phoneNumber });
  if (!driver) {
    return next(new AppError('No driver found with this phone number', 404));
  }

  driver.password = password;
  await driver.save(); 

  res.status(200).json({
    status: 'success',
    data: {
      driver
    }
  });
});
export const ApproveDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { backgroundCheck: true },
    { new: true }
  );

  if (!driver) {
    return next(new AppError('No driver found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      driver
    }
  });
});

export const DeactivateDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { status: false },
    { new: true }
  );

  if (!driver) {
    return next(new AppError('No driver found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      driver
    }
  });
});

export const ActivateDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { status: true },
    { new: true }
  );

  if (!driver) {
    return next(new AppError('No driver found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      driver
    }
  });
});

export const viewDrivers = catchAsync(async (req, res, next) => {
  const drivers = await Driver.find();

  res.status(200).json({
    status: 'success',
    results: drivers.length,
    data: {
      drivers
    }
  });
});

export const viewADriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    return next(new AppError('No driver found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      driver
    }
  });
});

// Get current driver profile
export const getCurrentDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findById(req.user.id).select('-password -__v');
  
  if (!driver) {
    return next(new AppError('No driver found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      driver
    }
  });
});

// Update current driver profile 
export const updateCurrentDriver = catchAsync(async (req, res, next) => {
  // Filter out unwanted fields (excluding vehicleRegNumber)
  const filteredBody = {
    fullname: req.body.fullname,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email
    // vehicleRegNumber is intentionally excluded
  };

  // Handle file upload if exists
  if (req.file) {
    filteredBody.driverPic = req.file.filename;
  }

  const updatedDriver = await Driver.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  ).select('-password -__v -vehicleRegNumber'); // Also exclude from response

  if (!updatedDriver) {
    return next(new AppError('No driver found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      driver: updatedDriver
    }
  });
});