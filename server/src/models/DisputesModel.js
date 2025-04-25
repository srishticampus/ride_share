//server/src/models/DisputesModel.js
import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Dispute:
 *       type: object
 *       required:
 *         - reportedBy
 *         - rideId
 *         - disputeType
 *       properties:
 *         reportedBy:
 *           type: string
 *           description: ID of the user who reported the dispute
 *         rideId:
 *           type: string
 *           description: ID of the ride associated with the dispute
 *         disputeType:
 *           type: string
 *           description: Type/category of the dispute
 *         description:
 *           type: string
 *           description: Detailed description of the dispute
 *         resolutionStatus:
 *           type: string
 *           enum: [Pending, Resolved, Rejected]
 *           default: Pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when dispute was created
 *         resolutionAt:
 *           type: string
 *           format: date-time
 *           description: Date when dispute was resolved
 */
const DisputeSchema = new Schema({
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter ID is required']
  },
  rideId: {
    type: Schema.Types.ObjectId,
    ref: 'Ride',
    required: [true, 'Ride ID is required']
  },
  disputeType: {
    type: String,
    required: [true, 'Dispute type is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  resolutionStatus: {
    type: String,
    enum: ['Pending', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolutionAt: Date
}, { timestamps: true });

export default model('Dispute', DisputeSchema);