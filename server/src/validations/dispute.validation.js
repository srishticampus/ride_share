//server/src/validations/dispute.validation.js
import Joi from 'joi';

export const disputeSchema = Joi.object({
  reportedBy: Joi.string().hex().length(24).required(),
  rideId: Joi.string().hex().length(24).required(),
  disputeType: Joi.string().valid('Payment', 'Behavior', 'Service', 'Other').required(),
  description: Joi.string().required(),
  resolutionStatus: Joi.string().valid('Pending', 'Resolved', 'Rejected')
});

export const updateDisputeSchema = disputeSchema.keys({
  reportedBy: Joi.string().hex().length(24),
  rideId: Joi.string().hex().length(24),
  disputeType: Joi.string().valid('Payment', 'Behavior', 'Service', 'Other'),
  description: Joi.string(),
  resolutionStatus: Joi.string().valid('Pending', 'Resolved', 'Rejected')
}).min(1);