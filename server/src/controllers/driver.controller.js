import { Driver, Vehicle } from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { signToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';

// Helper function to filter object fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const DriverRegistration = catchAsync(async (req, res, next) => {
  const { email, vehicleRegNumber, phoneNumber, password, licenseNumber, fullname } = req.body;
  
  const newDriver = await Driver.create({
    email,
    vehicleRegNumber,
    phoneNumber,
    password,
    licenseNumber,
    fullname,
    driverPic: req.file ? req.file.filename : undefined
  });

  const token = signToken(newDriver._id, 'driver');

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

  // 1) Check if phoneNumber and password exist
  if (!phoneNumber || !password) {
    return next(new AppError('Please provide phone number and password!', 400));
  }

  // 2) Check if driver exists and password is correct
  const driver = await Driver.findOne({ phoneNumber }).select('+password');

  if (!driver || !(await driver.correctPassword(password, driver.password))) {
    return next(new AppError('Incorrect phone number or password', 401));
  }

  // 3) Check if driver is approved and active
  if (!driver.backgroundCheck) {
    return next(new AppError('Your account is pending approval. Please wait for admin verification.', 403));
  }

  if (!driver.status) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 403));
  }

  // 4) If everything ok, send token to client
  const token = signToken(driver._id, 'driver');

  res.status(200).json({
    status: 'success',
    token,
    data: {
      driver
    }
  });
});

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

export const updateCurrentDriver = catchAsync(async (req, res, next) => {
  // 1) Filter out unwanted fields that shouldn't be updated
  const filteredBody = filterObj(
    req.body,
    'fullname',
    'phoneNumber',
    'email'
  );

  // 2) Handle file upload if exists
  if (req.file) {
    filteredBody.driverPic = req.file.filename;
  }

  // 3) Update driver document
  const updatedDriver = await Driver.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true
    }
  ).select('-password -__v');

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

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get driver from collection
  const driver = await Driver.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await driver.correctPassword(req.body.currentPassword, driver.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  driver.password = req.body.newPassword;
  await driver.save();

  // 4) Log driver in, send JWT
  const token = signToken(driver._id, 'driver');

  res.status(200).json({
    status: 'success',
    token,
    message: 'Password updated successfully!'
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

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get driver based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const driver = await Driver.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is driver, set the new password
  if (!driver) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  driver.password = req.body.password;
  driver.passwordResetToken = undefined;
  driver.passwordResetExpires = undefined;
  await driver.save();

  // 3) Update changedPasswordAt property for the driver
  // This is done in the driver model pre-save middleware

  // 4) Log the driver in, send JWT
  const token = signToken(driver._id, 'driver');

  res.status(200).json({
    status: 'success',
    token
  });
});

export const getDriverVehicle = catchAsync(async (req, res, next) => {
  const driver = await Driver.findById(req.user.id).populate('vehicleId');
  
  if (!driver || !driver.vehicleId) {
    return next(new AppError('No vehicle registered for this driver', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      vehicle: driver.vehicleId
    }
  });
});

export const goOnline = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndUpdate(
    req.user.id,
    { isOnline: true },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      driver
    }
  });
});

export const goOffline = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndUpdate(
    req.user.id,
    { isOnline: false },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      driver
    }
  });
});

// Admin functions
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

export const ApproveDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndUpdate(
    req.params.id,
    { 
      backgroundCheck: true,
      status: true 
    },
    { new: true }
  );

  if (!driver) {
    return next(new AppError('No driver found with that ID', 404));
  }

  // Send approval email
  await sendEmail({
    email: driver.email,
    subject: 'Your Driver Account Has Been Approved',
    message: `Congratulations! Your driver account has been approved. You can now log in and start accepting rides.`
  });

  res.status(200).json({
    status: 'success',
    data: {
      driver
    }
  });
});

export const rejectDriver = catchAsync(async (req, res, next) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);

  if (!driver) {
    return next(new AppError('No driver found with that ID', 404));
  }

  // Send rejection email
  await sendEmail({
    email: driver.email,
    subject: 'Your Driver Application Has Been Rejected',
    message: `We regret to inform you that your driver application has been rejected. ${req.body.reason || ''}`
  });

  res.status(204).json({
    status: 'success',
    data: null
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