import Joi from 'joi';

export const driverComplaintSchema = Joi.object({
  subject: Joi.string().min(5).max(100).required()
    .messages({
      'string.empty': 'Subject is required',
      'string.min': 'Subject should be at least 5 characters',
      'string.max': 'Subject cannot exceed 100 characters'
    }),
    
  incidentDate: Joi.date().max('now').required()
    .messages({
      'date.base': 'Please provide a valid date',
      'date.max': 'Incident date cannot be in the future',
      'any.required': 'Incident date is required'
    }),
    
  priorityLevel: Joi.string().valid('high', 'medium', 'low').required()
    .messages({
      'any.only': 'Priority must be either high, medium, or low',
      'any.required': 'Priority level is required'
    }),
    
  description: Joi.string().min(20).max(1000).required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description should be at least 20 characters',
      'string.max': 'Description cannot exceed 1000 characters'
    }),
    
  attachment: Joi.string().uri().optional()
    .messages({
      'string.uri': 'Attachment must be a valid URL'
    }),
    
  driverId: Joi.string().hex().length(24).required()
    .messages({
      'string.hex': 'Invalid driver ID format',
      'string.length': 'Driver ID must be 24 characters',
      'any.required': 'Driver ID is required'
    })
}).options({ abortEarly: false });