//server/src/validations/user.validation.js
import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  emergencyNo: Joi.string().required()
});

export const loginSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  password: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
  email: Joi.string().email(),
  fullName: Joi.string(),
  phoneNumber: Joi.string()
});

export const forgotPasswordSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});