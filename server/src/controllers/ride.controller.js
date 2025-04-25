//server/src/controllers/ride.controller.js
import {Ride} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const newRide = catchAsync(async (req, res, next) => {
  const ride = await Ride.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      ride
    }
  });
});

export const showAllRides = catchAsync(async (req, res, next) => {
  const rides = await Ride.find()
    .populate('driverId')
    .populate('riderId');

  res.status(200).json({
    status: 'success',
    results: rides.length,
    data: {
      rides
    }
  });
});

export const viewAride = catchAsync(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id)
    .populate('driverId')
    .populate('riderId');

  if (!ride) {
    return next(new AppError('No ride found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ride
    }
  });
});

export const updateRide = catchAsync(async (req, res, next) => {
  const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!ride) {
    return next(new AppError('No ride found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ride
    }
  });
});

export const deleteRide = catchAsync(async (req, res, next) => {
  const ride = await Ride.findByIdAndDelete(req.params.id);

  if (!ride) {
    return next(new AppError('No ride found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export default {
  newRide,
  showAllRides,
  viewAride,
  updateRide,
  deleteRide
};