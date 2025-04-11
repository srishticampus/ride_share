//server/src/models/RideRequestModel.js
import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     RideRequest:
 *       type: object
 *       properties:
 *         driverId:
 *           type: string
 *           description: ID of the requested driver
 *         riderId:
 *           type: string
 *           description: ID of the rider making the request
 *         requestTime:
 *           type: string
 *           format: date-time
 *           default: now
 *           description: Time when request was made
 *         status:
 *           type: string
 *           default: Pending
 *           description: Current status of the request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when request was last updated
 */
const RideRequestSchema = new Schema({
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver'
  },
  riderId: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  requestTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending'
  }
}, { timestamps: true });

export default model('RideRequest', RideRequestSchema);