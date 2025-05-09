// server/src/validations/dispute.validation.js
import Joi from 'joi';

export const disputeSchema = Joi.object({
  reportedBy: Joi.string().hex().length(24).required(),
  driverId: Joi.string().hex().length(24).required(),
  subject: Joi.string().max(100).required(),
  description: Joi.string().max(500).required(),
  priorityLevel: Joi.string().valid('High', 'Medium', 'Low').required(),
  incidentDate: Joi.date().less('now').required(),
  attachment: Joi.string().optional(),
  resolutionStatus: Joi.string().valid('Pending', 'Resolved', 'Rejected').optional()
});

export const updateDisputeSchema = disputeSchema.fork(
  ['reportedBy', 'driverId', 'subject', 'priorityLevel', 'incidentDate'],
  (schema) => schema.optional()
).min(1);
