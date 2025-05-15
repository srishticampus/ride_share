//server/src/controllers/ride.controller.js
import { Ride } from '../models/index.js';
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
    .populate({
      path: 'VehicleId',
      populate: {
        path: 'driverId'
      }
    });

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

export const addRideMessage = catchAsync(async (req, res, next) => {
  if (!req.body?.message) {
    return next(new AppError('Please provide a valid message', 400));
  }

  const ride = await Ride.findByIdAndUpdate(
    req.params.id,
    { 
      $push: { 
        messages: {
          text: req.body.message,
          sender: req.user.id,
          createdAt: new Date()
        }
      } 
    },
    { new: true, runValidators: true }
  );

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
  addRideMessage,
  deleteRide
};