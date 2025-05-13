//server/src/validations/ride.validation.js
import Joi from 'joi';

export const rideSchema = Joi.object({
  VehicleId: Joi.string().hex().length(24),
  riderId: Joi.string().hex().length(24),
  origin: Joi.string(),
  destination: Joi.string(),
  rideDate: Joi.date().iso(),
  rideTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'Please use HH:MM format'
    }),
  availableSeats: Joi.number().integer().min(1),
  price: Joi.number().positive().required(),
  status: Joi.string()
    .valid('pending', 'accepted', 'started', 'completed', 'cancelled', 'scheduled', 'available')
    .default('pending'),
  rideDescription: Joi.string().allow('').optional(),
  specialNote: Joi.string().allow('').optional(),
  route: Joi.string().allow('').optional()
});
export const updateRideSchema = rideSchema.keys({
  driverId: Joi.string().hex().length(24).required(),
  riderId: Joi.string().hex().length(24).required(),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  rideDate: Joi.date().iso().required(),
  rideTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'Please use HH:MM format'
    }),
  availableSeats: Joi.number().integer().min(1).required(),
  price: Joi.number().positive().required(),
  status: Joi.string()
    .valid('pending', 'accepted', 'started', 'completed', 'cancelled', 'scheduled', 'available')
    .default('pending'),
  rideDescription: Joi.string().allow('').optional(),
  specialNote: Joi.string().allow('').optional(),
  route: Joi.string().allow('').optional()
}).min(1);