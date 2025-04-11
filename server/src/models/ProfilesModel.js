//server/src/models/ProfilesModel.js
import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - userId
 *         - commuteStart
 *         - commuteEnd
 *         - workStartTime
 *         - wordEndTime
 *         - vehicleDetails
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the associated user
 *         commuteStart:
 *           type: string
 *           description: Starting location for commute
 *         commuteEnd:
 *           type: string
 *           description: Ending location for commute
 *         workStartTime:
 *           type: string
 *           description: Work start time (format HH:MM)
 *         wordEndTime:
 *           type: string
 *           description: Work end time (format HH:MM)
 *         vehicleDetails:
 *           type: string
 *           description: ID of the associated vehicle
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when profile was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when profile was last updated
 */
const ProfileSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  commuteStart: {
    type: String,
    required: [true, 'Commute start location is required'],
    trim: true
  },
  commuteEnd: {
    type: String,
    required: [true, 'Commute end location is required'],
    trim: true
  },
  workStartTime: {
    type: String,
    required: [true, 'Work start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  wordEndTime: {
    type: String,
    required: [true, 'Work end time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format']
  },
  vehicleDetails: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle details are required']
  }
}, { timestamps: true });

export default model('Profile', ProfileSchema);