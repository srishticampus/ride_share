//server/src/models/UserModel.js
import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullName
 *         - phoneNumber
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 8
 *           description: User's password (hashed)
 *         fullName:
 *           type: string
 *           description: User's full name
 *         phoneNumber:
 *           type: integer
 *           description: User's phone number
 *         profilePicture:
 *           type: string
 *           description: URL to user's profile picture
 *         isVerified:
 *           type: boolean
 *           default: true
 *           description: Whether user is verified
 *         commuteStatus:
 *           type: boolean
 *           default: false
 *           description: Whether user has active commute
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when user was last updated
 */
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phoneNumber: {
    type: Number,
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  profilePicture: String,
  isVerified: {
    type: Boolean,
    default: true
  },
  emergencyNo:{
    type: Number,
    required: [true, 'Emergency number is required']
  },
  commuteStatus: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export default model('User', UserSchema);