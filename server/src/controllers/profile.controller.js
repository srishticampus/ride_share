//server/src/controllers/profile.controller.js
import {Profile} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const setProfile = catchAsync(async (req, res, next) => {
  // Check if profile already exists for this user
  const existingProfile = await Profile.findOne({ userId: req.body.userId });
  if (existingProfile) {
    return next(new AppError('Profile already exists for this user', 400));
  }

  const profile = await Profile.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      profile
    }
  });
});

export const editProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!profile) {
    return next(new AppError('No profile found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

export const ShowAllProfiles = catchAsync(async (req, res, next) => {
  const profiles = await Profile.find()
    .populate('userId')
    .populate('vehicleDetails');

  res.status(200).json({
    status: 'success',
    results: profiles.length,
    data: {
      profiles
    }
  });
});

export const aProfile = catchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id)
    .populate('userId')
    .populate('vehicleDetails');

  if (!profile) {
    return next(new AppError('No profile found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      profile
    }
  });
});

export default {
  setProfile,
  editProfile,
  ShowAllProfiles,
  aProfile
};