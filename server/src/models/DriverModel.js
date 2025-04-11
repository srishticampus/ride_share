//src/models/DriverModel.js
import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       required:
 *         - fullname
 *         - phoneNumber
 *         - password
 *         - licenseNumber
 *       properties:
 *         fullname:
 *           type: string
 *           description: Driver's full name
 *         phoneNumber:
 *           type: integer
 *           description: Driver's phone number
 *         password:
 *           type: string
 *           minLength: 8
 *           description: Driver's password (hashed)
 *         licenseNumber:
 *           type: string
 *           description: Driver's license number
 *         driverPic:
 *           type: string
 *           description: URL to driver's profile picture
 *         backgroundCheck:
 *           type: boolean
 *           default: false
 *           description: Whether background check is completed
 *         status:
 *           type: boolean
 *           default: true
 *           description: Whether driver account is active
 *         userId:
 *           type: string
 *           description: Associated user account ID
 *         vehicleId:
 *           type: string
 *           description: Associated vehicle ID
 *         driverRating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Driver's average rating
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when driver was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when driver was last updated
 */
const DriverSchema = new Schema({
  fullname: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phoneNumber: {
    type: Number,
    unique: true,
    required: [true, 'Phone number is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  driverPic: String,
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true
  },
  backgroundCheck: {
    type: Boolean,
    default: false
  },
  status: {
    type: Boolean,
    default: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  driverRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  }
}, { timestamps: true });

// Hash password before saving
DriverSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
DriverSchema.methods.correctPassword = async function(candidatePassword, driverPassword) {
  return await bcrypt.compare(candidatePassword, driverPassword);
};

export default model('Driver', DriverSchema);