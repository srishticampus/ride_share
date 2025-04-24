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

export const findByPhoneSchema = Joi.object({
  phoneNumber: Joi.string().required().messages({
    'string.empty': 'Phone number is required',
    'any.required': 'Phone number is required'
  })
});

export const forgotPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});