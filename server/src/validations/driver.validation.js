//server/src/validations/driver.validation.js
import Joi from 'joi';

export const driverRegistrationSchema = Joi.object({
  email: Joi.string().email().required(),
  vehicleRegNumber: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(8).required(),
  licenseNumber: Joi.string().min(16).required(),
  fullname: Joi.string().required()
});

export const driverLoginSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  password: Joi.string().required()
});

export const updateDriverSchema = Joi.object({
  phoneNumber: Joi.string(),
  licenseNumber: Joi.string(),
  fullname: Joi.string(),
  vehicleRegNumber:Joi.string()
});
export const findByPhoneSchema = Joi.object({
  phoneNumber: Joi.number().required().messages({
    'string.empty': 'Phone number is required',
    'any.required': 'Phone number is required'
  })
});
export const forgotPasswordSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  })
});

export const meUpdateDriverSchema = Joi.object({
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  fullname: Joi.string(),
  vehicleRegNumber:Joi.string()

});