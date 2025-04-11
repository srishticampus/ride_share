//server/src/validations/driver.validation.js
import Joi from 'joi';

export const driverRegistrationSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
  licenseNumber: Joi.string().required(),
  fullname: Joi.string().required()
});

export const driverLoginSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  password: Joi.string().required()
});

export const updateDriverSchema = Joi.object({
  phoneNumber: Joi.string(),
  licenseNumber: Joi.string(),
  fullname: Joi.string()
});

export const forgotPasswordSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required()
});