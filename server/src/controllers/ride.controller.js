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
    })
    .populate('riderId')
    .populate('driverId')
    .populate('acceptedRiderId')
    .populate({
      path: 'messages.sender',
    });
    
  res.status(200).json({
    status: 'success',
    results: rides.length,
    data: {
      rides
    }
  });
});export const viewAride = catchAsync(async (req, res, next) => {
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

    const messageData = {
        text: req.body.message,
        sender: req.body.senderId,
        senderType: req.body.senderType,
        createdAt: new Date(),
        User: { _id: req.body.senderId }
    };

    const ride = await Ride.findByIdAndUpdate(
        req.params.id,
        { $push: { messages: messageData } },
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

export const joinRide = catchAsync(async (req, res, next) => {
  const { riderId } = req.body;

  if (!riderId) {
    return next(new AppError('Please provide a rider ID', 400));
  }

  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    return next(new AppError('No ride found with that ID', 404));
  }

  // Check if rider is already in the ride (either pending or accepted)
  const isAlreadyInRide = ride.riderId.includes(riderId) || 
                         ride.acceptedRiderId.includes(riderId);
  
  if (isAlreadyInRide) {
    return next(new AppError('You have already joined this ride', 400));
  }

  // Check available seats
  if (ride.acceptedRiderId.length >= ride.availableSeats) {
    return next(new AppError('No available seats left', 400));
  }

  // Add rider to riderId array
  ride.riderId.push(riderId);
  await ride.save();

  res.status(200).json({
    status: 'success',
    data: {
      ride
    }
  });
});
export const acceptReq = catchAsync(async (req, res, next) => {
  const { riderId } = req.body;

  if (!riderId) {
    return next(new AppError('Please provide a rider ID', 400));
  }

  // Find the ride first
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    return next(new AppError('Ride request not found', 404));
  }

  // Check if rider exists in riderId array
  if (!ride.riderId.includes(riderId)) {
    return next(new AppError('This rider has not requested this ride', 400));
  }

  // Check if rider is already accepted
  if (ride.acceptedRiderId.includes(riderId)) {
    return next(new AppError('This rider has already been accepted', 400));
  }

  // Check available seats
  if (ride.acceptedRiderId.length >= ride.availableSeats) {
    return next(new AppError('No available seats left', 400));
  }

  // Add rider to acceptedRiderId and remove from riderId
  ride.acceptedRiderId.push(riderId);
  ride.riderId = ride.riderId.filter(id => id.toString() !== riderId.toString());

  // Update status if all seats are filled
  if (ride.acceptedRiderId.length >= ride.availableSeats) {
    ride.status = 'accepted';
  }

  // Save the updated ride
  await ride.save();

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
// Add this to your ride.controller.js
export const rejectReq = catchAsync(async (req, res, next) => {
  const { riderId } = req.body;

  if (!riderId) {
    return next(new AppError('Please provide a rider ID', 400));
  }

  // Find the ride first
  const ride = await Ride.findById(req.params.id);
  if (!ride) {
    return next(new AppError('Ride request not found', 404));
  }

  // Check if rider exists in riderId array
  if (!ride.riderId.includes(riderId)) {
    return next(new AppError('This rider has not requested this ride', 400));
  }

  // Remove rider from riderId array
  ride.riderId = ride.riderId.filter(id => id.toString() !== riderId.toString());

  // Save the updated ride
  await ride.save();

  res.status(200).json({
    status: 'success',
    data: {
      ride
    }
  });
});

export default {
  newRide,
  showAllRides,
  viewAride,
  addRideMessage,
  deleteRide,
  acceptReq,
  joinRide,
  rejectReq
};