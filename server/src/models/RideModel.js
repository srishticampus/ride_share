//server/src/models/RideModel.js
import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       required:
 *         - riderId
 *         - origin
 *         - distination
 *         - rideDate
 *         - rideTime
 *         - price
 *       properties:
 *         driverId:
 *           type: string
 *           description: ID of the driver (optional)
 *         riderId:
 *           type: string
 *           description: ID of the rider
 *         origin:
 *           type: string
 *           description: Starting location of the ride
 *         distination:
 *           type: string
 *           description: Destination of the ride
 *         rideDate:
 *           type: string
 *           format: date
 *           description: Date of the ride
 *         rideTime:
 *           type: string
 *           description: Time of the ride (format HH:MM)
 *         status:
 *           type: string
 *           enum: [Pending, Accepted, Cancelled]
 *           default: Pending
 *           description: Current status of the ride
 *         price:
 *           type: number
 *           description: Price for the ride
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when ride was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when ride was last updated
 */
const RideSchema = new Schema({
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver'
  },
  riderId: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  rideDate: {
    type: Date,
    required: [true, 'Ride date is required']
  },
  rideTime: {
    type: String,
    required: [true, 'Ride time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Available seats are required'],
    min: [1, 'At least 1 seat must be available']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'started', 'completed', 'cancelled', 'scheduled', 'available'],
    default: 'pending'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  rideDescription: {
    type: String,
    trim: true
  },
  specialNote: {
    type: String,
    trim: true
  },
  route: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default model('Ride', RideSchema);
