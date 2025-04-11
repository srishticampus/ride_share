//server/src/routes/ride.routes.js
import express from 'express';
import RideController from '../controllers/ride.controller.js';
import { rideSchema, updateRideSchema } from '../validations/ride.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import {protect,restrictTo} from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ride
 *   description: Ride management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       required:
 *         - driverId
 *         - riderId
 *         - origin
 *         - destination
 *         - price
 *       properties:
 *         driverId:
 *           type: string
 *         riderId:
 *           type: string
 *         origin:
 *           type: string
 *         destination:
 *           type: string
 *         rideDate:
 *           type: string
 *           format: date
 *         rideTime:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *         price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, accepted, started, completed, cancelled]
 */

/**
 * @swagger
 * /api/newride:
 *   post:
 *     summary: Create a new ride
 *     tags: [Ride]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ride'
 *     responses:
 *       201:
 *         description: Ride created successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/newride',
  protect,
  validate(rideSchema),
  RideController.newRide
);

/**
 * @swagger
 * /api/showAllRide:
 *   get:
 *     summary: Get all rides
 *     tags: [Ride]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of rides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 */
router.get(
  '/showAllRide',
  protect,
  RideController.showAllRides
);

/**
 * @swagger
 * /api/showAride/{id}:
 *   get:
 *     summary: Get a single ride
 *     tags: [Ride]
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
 *         description: Ride data
 *       404:
 *         description: Ride not found
 */
router.get(
  '/showAride/:id',
  protect,
  RideController.viewAride
);

/**
 * @swagger
 * /api/updateRide/{id}:
 *   patch:
 *     summary: Update a ride
 *     tags: [Ride]
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
 *             $ref: '#/components/schemas/Ride'
 *     responses:
 *       200:
 *         description: Ride updated successfully
 *       404:
 *         description: Ride not found
 */
router.patch(
  '/updateRide/:id',
  protect,
  validate(updateRideSchema),
  RideController.updateRide
);

/**
 * @swagger
 * /api/deleteRide/{id}:
 *   delete:
 *     summary: Delete a ride
 *     tags: [Ride]
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
 *         description: Ride deleted successfully
 *       404:
 *         description: Ride not found
 */
router.delete(
  '/deleteRide/:id',
  protect,
  RideController.deleteRide
);

export default router;