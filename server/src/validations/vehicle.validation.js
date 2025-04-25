//server/src/validations/vehicle.validation.js
import Joi from 'joi';

export const vehicleSchema = Joi.object({
  vehicleRegistrationNo: Joi.string().required(),
  vehicleMake: Joi.string().required(),
  vehicleModel: Joi.string().required(),
  vehicleYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  vehicleColor: Joi.string(),
  vehicleType: Joi.string().valid('sedan', 'suv', 'truck', 'van', 'motorcycle').required(),
  vehicleCapacity: Joi.number().integer().min(1).required(),
  vehicleFuelType: Joi.string().valid('gasoline', 'diesel', 'electric', 'hybrid').required(),
  driverId: Joi.string().hex().length(24).required(),
  insuranceStatus: Joi.boolean().default(false)
});

export const updateVehicleSchema = vehicleSchema.keys({
  vehicleRegistrationNo: Joi.string(),
  vehicleMake: Joi.string(),
  vehicleModel: Joi.string(),
  vehicleYear: Joi.number().integer().min(1900).max(new Date().getFullYear()),
  vehicleType: Joi.string().valid('sedan', 'suv', 'truck', 'van', 'motorcycle'),
  vehicleCapacity: Joi.number().integer().min(1),
  vehicleFuelType: Joi.string().valid('gasoline', 'diesel', 'electric', 'hybrid'),
  driverId: Joi.string().hex().length(24)
}).min(1);