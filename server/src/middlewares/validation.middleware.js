//server/src/middlewares/validation.middleware.js
import AppError from '../utils/appError.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  });
  
  if (error) {
    const messages = error.details.map(el => el.message).join(', ');
    return next(new AppError(messages, 400));
  }
  
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params);
  
  if (error) {
    const messages = error.details.map(el => el.message).join(', ');
    return next(new AppError(messages, 400));
  }
  
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query);
  
  if (error) {
    const messages = error.details.map(el => el.message).join(', ');
    return next(new AppError(messages, 400));
  }
  
  next();
};

export const validateFile = (fieldName, allowedTypes, maxSize) => (req, res, next) => {
  if (!req.file) {
    return next(new AppError(`Please upload a ${fieldName}`, 400));
  }

  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new AppError(
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 
      400
    ));
  }

  if (req.file.size > maxSize) {
    return next(new AppError(
      `File too large. Max size: ${maxSize / (1024 * 1024)}MB`, 
      400
    ));
  }

  next();
};