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
 *         - destination
 *         - rideDate
 *         - rideTime
 *         - price
 *         - availableSeats
 *       properties:
 *         VehicleId:
 *           type: string
 *           description: ID of the vehicle
 *         riderId:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of riders requesting the ride
 *         driverId:
 *           type: string
 *           description: ID of the driver
 *         acceptedRiderId:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of accepted riders
 *         origin:
 *           type: string
 *           description: Starting location of the ride
 *         destination:
 *           type: string
 *           description: Destination of the ride
 *         rideDate:
 *           type: string
 *           format: date
 *           description: Date of the ride
 *         rideTime:
 *           type: string
 *           description: Time of the ride (format HH:MM)
 *         availableSeats:
 *           type: number
 *           description: Number of available seats
 *         status:
 *           type: string
 *           enum: [pending, accepted, started, completed, cancelled, scheduled, available]
 *           default: pending
 *           description: Current status of the ride
 *         price:
 *           type: number
 *           description: Price for the ride per rider
 *         rideDescription:
 *           type: string
 *           description: Description of the ride
 *         specialNote:
 *           type: string
 *           description: Special notes for the ride
 *         route:
 *           type: string
 *           description: Route details
 *         messages:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               sender:
 *                 type: string
 *               senderType:
 *                 type: string
 *                 enum: [User, Driver]
 *               PaymentMode:
 *                 type: string
 *                 enum: [Cash, OnlinePayment]
 *               paymentStatus:
 *                 type: string
 *                 enum: [Pending, Completed, Failed]
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         successfulPayments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               riderId:
 *                 type: string
 *               paymentTime:
 *                 type: string
 *                 format: date-time
 *               amount:
 *                 type: number
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: When the ride was completed
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the ride was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the ride was last updated
 */
const RideSchema = new Schema({
  VehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  riderId: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }], 
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver'
  },
  acceptedRiderId: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
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
  },
  messages: [{
    text: {
      type: String,
      required: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'messages.senderType'
    },
    senderType: {
      type: String,
      required: true,
      enum: ['User', 'Driver']
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  successfulPayments: [{
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    paymentTime: {
      type: Date,
      required: true,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
        PaymentMode: {
      type: String,
      enum: ['Cash', 'OnlinePayment'],
      default: 'Cash'
    }

  }],
  completedAt: {
    type: Date
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Virtual for checking if all riders have paid
RideSchema.virtual('allRidersPaid').get(function() {
  if (!this.acceptedRiderId || this.acceptedRiderId.length === 0) return false;
  if (!this.successfulPayments || this.successfulPayments.length === 0) return false;
  
  return this.acceptedRiderId.every(acceptedRiderId => 
    this.successfulPayments.some(
      payment => payment.riderId.toString() === acceptedRiderId.toString()
    )
  );
});

export default model('Ride', RideSchema);