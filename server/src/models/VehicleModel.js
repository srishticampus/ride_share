//server/src/models/VehicleModel.js
import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       required:
 *         - vehicleRegistrationNo
 *         - vehicleMake
 *         - vehicleModel
 *         - vehicleYear
 *         - vehicleColor
 *         - vehicleType
 *         - vehicleCapacity
 *         - vehicleFuelType
 *         - driverId
 *       properties:
 *         vehicleRegistrationNo:
 *           type: string
 *           description: Vehicle registration number
 *         vehicleMake:
 *           type: string
 *           description: Vehicle manufacturer
 *         vehicleModel:
 *           type: string
 *           description: Vehicle model
 *         vehicleYear:
 *           type: integer
 *           description: Vehicle manufacturing year
 *         vehicleColor:
 *           type: string
 *           description: Vehicle color
 *         vehicleType:
 *           type: string
 *           description: Type of vehicle (e.g., Sedan, SUV)
 *         vehicleCapacity:
 *           type: integer
 *           description: Passenger capacity
 *         vehicleFuelType:
 *           type: string
 *           description: Type of fuel used
 *         insuranceStatus:
 *           type: boolean
 *           description: Whether vehicle is insured
 *         driverId:
 *           type: string
 *           description: ID of the driver who owns this vehicle
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when vehicle was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when vehicle was last updated
 */
const VehicleSchema = new Schema({
  vehicleRegistrationNo: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  vehicleMake: {
    type: String,
    required: [true, 'Make is required'],
    trim: true
  },
  vehicleModel: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  vehicleYear: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, `Year cannot be in the future`]
  },
  vehicleColor: {
    type: String,
    required: [true, 'Color is required'],
    trim: true
  },
  vehicleType: {
    type: String,
    required: [true, 'Type is required'],
    trim: true
  },
  vehicleCapacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  vehicleFuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    trim: true
  },
  insuranceStatus: Boolean,
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: [true, 'Driver ID is required']
  }
}, { timestamps: true });

export default model('Vehicle', VehicleSchema);