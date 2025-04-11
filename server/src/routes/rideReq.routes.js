//server/src/routes/rideReq.routes.js
import express from 'express';
import RideReqController from '../controllers/rideReq.controller.js';
import { rideRequestSchema, updateRideRequestSchema } from '../validations/rideReq.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import {protect,restrictTo} from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: RideRequest
 *   description: Ride request management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RideRequest:
 *       type: object
 *       required:
 *         - riderId
 *         - driverId
 *       properties:
 *         riderId:
 *           type: string
 *         driverId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, accepted, declined, cancelled]
 */

/**
 * @swagger
 * /api/newReqride:
 *   post:
 *     summary: Create a new ride request
 *     tags: [RideRequest]
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
 *       400:
 *         description: Bad request
 */
router.post(
  '/newReqride',
  protect,
  validate(rideRequestSchema),
  RideReqController.addRideReq
);

/**
 * @swagger
 * /api/viewRideReq/{id}:
 *   get:
 *     summary: Get a ride request by ID
 *     tags: [RideRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride request details
 *       404:
 *         description: Ride request not found
 */
router.get(
  '/viewRideReq/:id',
  protect,
  RideReqController.viewReq
);

/**
 * @swagger
 * /api/allRideReq:
 *   get:
 *     summary: Get all ride requests
 *     tags: [RideRequest]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ride requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RideRequest'
 */
router.get(
  '/allRideReq',
  protect,
  RideReqController.allReq
);

/**
 * @swagger
 * /api/acceptReq/{id}:
 *   patch:
 *     summary: Accept a ride request
 *     tags: [RideRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride request accepted
 *       404:
 *         description: Ride request not found
 */
router.patch(
  '/acceptReq/:id',
  protect,
  restrictTo('driver'),
  RideReqController.acceptReq
);

/**
 * @swagger
 * /api/dislineReq/{id}:
 *   patch:
 *     summary: Decline a ride request
 *     tags: [RideRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride request declined
 *       404:
 *         description: Ride request not found
 */
router.patch(
  '/dislineReq/:id',
  protect,
  restrictTo('driver'),
  RideReqController.dislineReq
);

/**
 * @swagger
 * /api/cancelReq/{id}:
 *   delete:
 *     summary: Cancel a ride request
 *     tags: [RideRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ride request cancelled
 *       404:
 *         description: Ride request not found
 */
router.delete(
  '/cancelReq/:id',
  protect,
  RideReqController.deleteReq
);

/**
 * @swagger
 * /api/changeDriver/{id}:
 *   patch:
 *     summary: Change driver for a ride request
 *     tags: [RideRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver changed successfully
 *       404:
 *         description: Ride request not found
 */
router.patch(
  '/changeDriver/:id',
  protect,
  validate(updateRideRequestSchema),
  RideReqController.changeDriver
);

/**
 * @swagger
 * /api/viewARideReq/{id}:
 *   get:
 *     summary: Get a single ride request
 *     tags: [RideRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ride request details
 *       404:
 *         description: Ride request not found
 */
router.get(
  '/viewARideReq/:id',
  protect,
  RideReqController.viewARideRequest
);

export default router;