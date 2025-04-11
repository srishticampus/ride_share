//server/src/validations/rating.validation.js
import Joi from 'joi';

export const ratingSchema = Joi.object({
  rideId: Joi.string().hex().length(24).required(),
  reviewerId: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  reviewText: Joi.string()
});

export const updateRatingSchema = ratingSchema.keys({
  rideId: Joi.string().hex().length(24),
  reviewerId: Joi.string().hex().length(24),
  rating: Joi.number().min(1).max(5),
  reviewText: Joi.string()
}).min(1);