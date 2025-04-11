//server/src/controllers/payment.controller.js
import {Payment} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const newPayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      payment
    }
  });
});

export const confirmPayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { paymentStatus: 'completed' },
    { new: true }
  );

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});

export const FailedPayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { paymentStatus: 'failed' },
    { new: true }
  );

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      payment
    }
  });
});

export const showCompletedPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ paymentStatus: 'completed' });

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments
    }
  });
});

export const showFailedPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ paymentStatus: 'failed' });

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments
    }
  });
});

export default {
  newPayment,
  confirmPayment,
  FailedPayment,
  showCompletedPayments,
  showFailedPayments
};