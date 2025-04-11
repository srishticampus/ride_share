//server/src/controllers/vehicle.controller.js
import {Vehicle} from '../models/index.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const AddVehicleDtl = catchAsync(async (req, res, next) => {
  const {
    vehicleRegistrationNo,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehicleColor,
    vehicleType,
    vehicleCapacity,
    vehicleFuelType,
    driverId,
    insuranceStatus
  } = req.body;

  // Check if vehicle with same registration exists
  const existingVehicle = await Vehicle.findOne({ vehicleRegistrationNo });
  if (existingVehicle) {
    return next(new AppError('Vehicle with this registration number already exists', 400));
  }

  const vehicle = await Vehicle.create({
    vehicleRegistrationNo,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    vehicleColor,
    vehicleType,
    vehicleCapacity,
    vehicleFuelType,
    driverId,
    insuranceStatus
  });

  res.status(201).json({
    status: 'success',
    data: {
      vehicle
    }
  });
});

export const updateDetails = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!vehicle) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      vehicle
    }
  });
});

export const ShowAllVehicle = catchAsync(async (req, res, next) => {
  const vehicles = await Vehicle.find().populate('driverId');

  res.status(200).json({
    status: 'success',
    results: vehicles.length,
    data: {
      vehicles
    }
  });
});

export const ShowAVehicle = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('driverId');

  if (!vehicle) {
    return next(new AppError('No vehicle found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      vehicle
    }
  });
});

export default {
  AddVehicleDtl,
  updateDetails,
  ShowAllVehicle,
  ShowAVehicle
};