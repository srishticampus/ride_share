//server/src/models/RatingModel.js
import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       required:
 *         - rideId
 *         - reviewerId
 *         - rating
 *       properties:
 *         rideId:
 *           type: string
 *           description: ID of the rated ride
 *         reviewerId:
 *           type: string
 *           description: ID of the user giving the rating
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating value (1-5)
 *         reviewText:
 *           type: string
 *           maxLength: 500
 *           description: Optional review text
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when rating was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when rating was last updated
 */
const RatingSchema = new Schema({
  rideId: {
    type: Schema.Types.ObjectId,
    ref: 'Ride',
    required: [true, 'Ride ID is required']
  },
  reviewerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewText: {
    type: String,
    trim: true,
    maxlength: [500, 'Review cannot exceed 500 characters']
  }
}, { timestamps: true });

export default model('Rating', RatingSchema);