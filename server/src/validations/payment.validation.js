//server/src/validations/payment.validation.js
import Joi from 'joi';

export const paymentSchema = Joi.object({
  rideId: Joi.string().hex().length(24).required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('cash', 'card', 'mobile_money').required(),
  paymentStatus: Joi.string().valid('pending', 'completed', 'failed')
});

export const updatePaymentSchema = paymentSchema.keys({
  rideId: Joi.string().hex().length(24),
  amount: Joi.number().positive(),
  paymentMethod: Joi.string().valid('cash', 'card', 'mobile_money'),
  paymentStatus: Joi.string().valid('pending', 'completed', 'failed')
}).min(1);