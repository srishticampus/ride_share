//server/src/controllers/rating.controller.js
import {Rating} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const newRating = catchAsync(async (req, res, next) => {
  const rating = await Rating.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      rating
    }
  });
});

export const editRating = catchAsync(async (req, res, next) => {
  const rating = await Rating.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!rating) {
    return next(new AppError('No rating found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rating
    }
  });
});

export const deleteRating = catchAsync(async (req, res, next) => {
  const rating = await Rating.findByIdAndDelete(req.params.id);

  if (!rating) {
    return next(new AppError('No rating found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const viewAllRating = catchAsync(async (req, res, next) => {
  const ratings = await Rating.find();

  res.status(200).json({
    status: 'success',
    results: ratings.length,
    data: {
      ratings
    }
  });
});

export const viewARating = catchAsync(async (req, res, next) => {
  const rating = await Rating.findById(req.params.id);

  if (!rating) {
    return next(new AppError('No rating found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rating
    }
  });
});

export default {
  newRating,
  editRating,
  deleteRating,
  viewAllRating,
  viewARating
};