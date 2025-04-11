//server/src/models/PaymentModel.js
import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - rideId
 *         - payerId
 *         - amount
 *         - paymentMethod
 *       properties:
 *         rideId:
 *           type: string
 *           description: ID of the associated ride
 *         payerId:
 *           type: string
 *           description: ID of the user making the payment
 *         amount:
 *           type: number
 *           minimum: 0
 *           description: Payment amount
 *         paymentStatus:
 *           type: string
 *           enum: [Pending, Completed, Failed]
 *           default: Pending
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           default: now
 *           description: Date when payment was made
 *         paymentMethod:
 *           type: string
 *           enum: [Cash, Online Payment]
 *           description: Payment method used
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when payment record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when payment record was last updated
 */
const PaymentSchema = new Schema({
  rideId: {
    type: Schema.Types.ObjectId,
    ref: 'Ride',
    required: [true, 'Ride ID is required']
  },
  payerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payer ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['Cash', 'Online Payment']
  }
}, { timestamps: true });

export default model('Payment', PaymentSchema);