//server/src/routes/disputes.routes.js
import express from 'express';
import DisputeController from '../controllers/disputes.controller.js';
import { disputeSchema } from '../validations/dispute.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import {protect,restrictTo} from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dispute
 *   description: Dispute management
 */

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
 * /api/dispute:
 *   post:
 *     summary: Create a new dispute
 *     tags: [Dispute]
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
 *       400:
 *         description: Bad request
 */
router.post(
  '/dispute',
  protect,
  validate(disputeSchema),
  DisputeController.newDispute
);

/**
 * @swagger
 * /api/solved/{id}:
 *   patch:
 *     summary: Mark dispute as solved (Admin only)
 *     tags: [Dispute]
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispute marked as solved
 *       404:
 *         description: Dispute not found
 */
router.patch(
  '/solved/:id',
  protect,
  restrictTo('admin'),
  DisputeController.disputeSolve
);

/**
 * @swagger
 * /api/dismiss/{id}:
 *   patch:
 *     summary: Mark dispute as dismissed (Admin only)
 *     tags: [Dispute]
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispute marked as dismissed
 *       404:
 *         description: Dispute not found
 */
router.patch(
  '/dismiss/:id',
  protect,
  restrictTo('admin'),
  DisputeController.disputeDismissed
);

/**
 * @swagger
 * /api/viewDisputed:
 *   get:
 *     summary: Get all disputes (Admin only)
 *     tags: [Dispute]
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
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
router.get(
  '/viewDisputed',
  protect,
  restrictTo('admin'),
  DisputeController.showAllDisputes
);

/**
 * @swagger
 * /api/showAdispute/{id}:
 *   get:
 *     summary: Get a single dispute (Admin only)
 *     tags: [Dispute]
 *     security:
 *       - bearerAuth: []
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispute details
 *       404:
 *         description: Dispute not found
 */
router.get(
  '/showAdispute/:id',
  protect,
  restrictTo('admin'),
  DisputeController.showADisputes
);

export default router;
