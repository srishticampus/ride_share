//server/src/routes/disputes.routes.js
import express from 'express';
import DisputeController from '../controllers/disputes.controller.js';
import { disputeSchema } from '../validations/dispute.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Dispute:
 *       type: object
 *       required:
 *         - reportedBy
 *         - rideId
 *         - disputeType
 *         - description
 *       properties:
 *         reportedBy:
 *           type: string
 *         rideId:
 *           type: string
 *         disputeType:
 *           type: string
 *           enum: [payment, behavior, service, other]
 *         description:
 *           type: string
 *         resolutionStatus:
 *           type: string
 *           enum: [pending, solved, dismissed]
 */

/**
 * @swagger
 * tags:
 *   name: Disputes
 *   description: Dispute management endpoints
 */

router.use(protect);

/**
 * @swagger
 * /disputes:
 *   post:
 *     summary: Create a new dispute
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Dispute'
 *     responses:
 *       201:
 *         description: Dispute created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dispute'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(disputeSchema), DisputeController.newDispute);

/**
 * @swagger
 * /disputes:
 *   get:
 *     summary: Get all disputes (Admin only)
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of disputes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dispute'
 */
router.get('/', restrictTo('admin'), DisputeController.showAllDisputes);

/**
 * @swagger
 * /disputes/{id}:
 *   get:
 *     summary: Get a single dispute
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Dispute details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dispute'
 *       404:
 *         description: Dispute not found
 */
router.get('/:id', DisputeController.showADisputes);

/**
 * @swagger
 * /disputes/{id}/solve:
 *   patch:
 *     summary: Mark dispute as solved (Admin only)
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Dispute marked as solved
 *       404:
 *         description: Dispute not found
 */
router.patch('/:id/solve', restrictTo('admin'), DisputeController.disputeSolve);

/**
 * @swagger
 * /disputes/{id}/dismiss:
 *   patch:
 *     summary: Mark dispute as dismissed (Admin only)
 *     tags: [Disputes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Dispute marked as dismissed
 *       404:
 *         description: Dispute not found
 */
router.patch('/:id/dismiss', restrictTo('admin'), DisputeController.disputeDismissed);

export default router;