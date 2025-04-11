//server/src/validations/profile.validation.js
import Joi from 'joi';

export const profileSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  commuteStart: Joi.string().required(),
  commuteEnd: Joi.string().required(),
  workStartTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  workEndTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  vehicleDetails: Joi.string().hex().length(24)
});

export const updateProfileSchema = profileSchema.keys({
  userId: Joi.string().hex().length(24),
  commuteStart: Joi.string(),
  commuteEnd: Joi.string(),
  workStartTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  workEndTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  vehicleDetails: Joi.string().hex().length(24)
}).min(1);