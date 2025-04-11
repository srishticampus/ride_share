//server/src/validations/ride.validation.js
import Joi from 'joi';

export const rideSchema = Joi.object({
  driverId: Joi.string().hex().length(24).required(),
  riderId: Joi.string().hex().length(24).required(),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  rideDate: Joi.date().iso(),
  rideTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  price: Joi.number().positive().required(),
  status: Joi.string().valid('pending', 'accepted', 'started', 'completed', 'cancelled')
});

export const updateRideSchema = rideSchema.keys({
  driverId: Joi.string().hex().length(24),
  riderId: Joi.string().hex().length(24),
  origin: Joi.string(),
  destination: Joi.string(),
  price: Joi.number().positive(),
  status: Joi.string().valid('pending', 'accepted', 'started', 'completed', 'cancelled')
}).min(1);