//server/src/validations/rideReq.validation.js
import Joi from 'joi';

export const rideRequestSchema = Joi.object({
  riderId: Joi.string().hex().length(24).required(),
  driverId: Joi.string().hex().length(24).required(),
  status: Joi.string().valid('pending', 'accepted', 'declined', 'cancelled')
});

export const updateRideRequestSchema = rideRequestSchema.keys({
  riderId: Joi.string().hex().length(24),
  driverId: Joi.string().hex().length(24),
  status: Joi.string().valid('pending', 'accepted', 'declined', 'cancelled')
}).min(1);