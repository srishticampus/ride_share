//server/src/controllers/disputes.controller.js
import {Dispute} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const newDispute = catchAsync(async (req, res, next) => {
  const dispute = await Dispute.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      dispute
    }
  });
});

export const disputeSolve = catchAsync(async (req, res, next) => {
  const dispute = await Dispute.findByIdAndUpdate(
    req.params.id,
    { resolutionStatus: 'solved' },
    { new: true }
  );

  if (!dispute) {
    return next(new AppError('Dispute not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      dispute
    }
  });
});

export const disputeDismissed = catchAsync(async (req, res, next) => {
  const dispute = await Dispute.findByIdAndUpdate(
    req.params.id,
    { resolutionStatus: 'dismissed' },
    { new: true }
  );

  if (!dispute) {
    return next(new AppError('Dispute not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      dispute
    }
  });
});

export const showAllDisputes = catchAsync(async (req, res, next) => {
  const disputes = await Dispute.find()
    .populate('reportedBy')
    .populate('rideId');

  res.status(200).json({
    status: 'success',
    results: disputes.length,
    data: {
      disputes
    }
  });
});

export const showADisputes = catchAsync(async (req, res, next) => {
  const dispute = await Dispute.findById(req.params.id)
    .populate('reportedBy')
    .populate('rideId');

  if (!dispute) {
    return next(new AppError('Dispute not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      dispute
    }
  });
});

export default {
  newDispute,
  disputeSolve,
  disputeDismissed,
  showAllDisputes,
  showADisputes
};