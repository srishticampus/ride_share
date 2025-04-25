//server/src/controllers/rideReq.controller.js
import {RideRequest} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const addRideReq = catchAsync(async (req, res, next) => {
  const rideReq = await RideRequest.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      rideReq
    }
  });
});

export const viewReq = catchAsync(async (req, res, next) => {
  const rideReq = await RideRequest.findById(req.params.id)
    .populate('riderId')
    .populate('driverId');

  if (!rideReq) {
    return next(new AppError('Ride request not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rideReq
    }
  });
});

export const allReq = catchAsync(async (req, res, next) => {
  const rideReqs = await RideRequest.find()
    .populate('riderId')
    .populate('driverId');

  res.status(200).json({
    status: 'success',
    results: rideReqs.length,
    data: {
      rideReqs
    }
  });
});

export const acceptReq = catchAsync(async (req, res, next) => {
  const rideReq = await RideRequest.findByIdAndUpdate(
    req.params.id,
    { status: 'accepted' },
    { new: true }
  );

  if (!rideReq) {
    return next(new AppError('Ride request not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rideReq
    }
  });
});

export const dislineReq = catchAsync(async (req, res, next) => {
  const rideReq = await RideRequest.findByIdAndUpdate(
    req.params.id,
    { status: 'declined' },
    { new: true }
  );

  if (!rideReq) {
    return next(new AppError('Ride request not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rideReq
    }
  });
});

export const deleteReq = catchAsync(async (req, res, next) => {
  const rideReq = await RideRequest.findByIdAndDelete(req.params.id);

  if (!rideReq) {
    return next(new AppError('Ride request not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const changeDriver = catchAsync(async (req, res, next) => {
  const rideReq = await RideRequest.findByIdAndUpdate(
    req.params.id,
    { driverId: req.body.driverId },
    { new: true }
  );

  if (!rideReq) {
    return next(new AppError('Ride request not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rideReq
    }
  });
});

export const viewARideRequest = catchAsync(async (req, res, next) => {
  const rideReq = await RideRequest.findById(req.params.id)
    .populate('driverId')
    .populate('riderId');

  if (!rideReq) {
    return next(new AppError('Ride request not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rideReq
    }
  });
});

export default {
  addRideReq,
  viewReq,
  allReq,
  acceptReq,
  dislineReq,
  deleteReq,
  changeDriver,
  viewARideRequest
};