// server/src/models/DisputesModel.js
import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Dispute:
 *       type: object
 *       required:
 *         - reportedBy
 *         - driverId
 *         - subject
 *         - incidentDate
 *       properties:
 *         reportedBy:
 *           type: string
 *           description: ID of the user who reported the dispute
 *         driverId:
 *           type: string
 *           description: ID of the driver associated with the dispute
 *         subject:
 *           type: string
 *           description: Subject or title of the dispute
 *         description:
 *           type: string
 *           description: Detailed description of the dispute
 *         priorityLevel:
 *           type: string
 *           description: Priority level of the dispute (High, Medium, Low)
 *         incidentDate:
 *           type: string
 *           format: date
 *           description: Date when the incident happened
 *         attachment:
 *           type: string
 *           description: Optional file attachment
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
    // required: [true, 'Reporter ID is required']
  },

  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    // required: [true, 'Driver ID is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  priorityLevel: {
    type: String,
    required: [true, 'Priority level is required']
  },
  incidentDate: {
    type: Date,
    required: [true, 'Incident date is required'],
    validate: {
      validator: function(date) {
        return date <= new Date();
      },
      message: 'Incident date cannot be in the future'
    }
  },
  attachment: {
    type: Object, 
    required: false
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
