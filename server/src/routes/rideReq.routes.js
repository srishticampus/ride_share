//server/src/routes/rideReq.routes.js
import express from 'express';
import RideReqController from '../controllers/rideReq.controller.js';
import { rideRequestSchema, updateRideRequestSchema } from '../validations/rideReq.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RideRequest:
 *       type: object
 *       required:
 *         - riderId
 *         - driverId
 *         - pickupLocation
 *         - dropoffLocation
 *       properties:
 *         riderId:
 *           type: string
 *         driverId:
 *           type: string
 *         pickupLocation:
 *           type: string
 *         dropoffLocation:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, accepted, rejected, cancelled, completed]
 */

/**
 * @swagger
 * tags:
 *   name: RideRequests
 *   description: Ride request management endpoints
 */

router.use(protect);

/**
 * @swagger
 * /ride-requests:
 *   post:
 *     summary: Create new ride request
 *     tags: [RideRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RideRequest'
 *     responses:
 *       201:
 *         description: Ride request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RideRequest'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(rideRequestSchema), RideReqController.addRideReq);

/**
 * @swagger
 * /ride-requests/{id}/accept:
 *   patch:
 *     summary: Accept ride request (Driver only)
 *     tags: [RideRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Ride request accepted
 *       403:
 *         description: Forbidden - Driver access required
 *       404:
 *         description: Ride request not found
 */
router.patch('/:id/accept', restrictTo('driver'), RideReqController.acceptReq);

/**
 * @swagger
 * /ride-requests/{id}/reject:
 *   patch:
 *     summary: Reject ride request (Driver only)
 *     tags: [RideRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Ride request rejected
 *       403:
 *         description: Forbidden - Driver access required
 *       404:
 *         description: Ride request not found
 */
router.patch('/:id/reject', restrictTo('driver'), RideReqController.dislineReq);

export default router;