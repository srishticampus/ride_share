//server/src/routes/ride.routes.js
import express from 'express';
import RideController from '../controllers/ride.controller.js';
import { rideSchema, updateRideSchema } from '../validations/ride.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

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
 *         price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, accepted, started, completed, cancelled]
 */

/**
 * @swagger
 * tags:
 *   name: Rides
 *   description: Ride management endpoints
 */

router.use(protect);

/**
 * @swagger
 * /rides:
 *   post:
 *     summary: Create new ride
 *     tags: [Rides]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ride'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(rideSchema), RideController.newRide);

/**
 * @swagger
 * /rides:
 *   get:
 *     summary: Get all rides
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all rides
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ride'
 */
router.get('/', RideController.showAllRides);

/**
 * @swagger
 * /rides/{id}:
 *   get:
 *     summary: Get ride by ID
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Ride details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ride'
 *       404:
 *         description: Ride not found
 */
router.get('/:id', RideController.viewAride);

/**
 * @swagger
 * /rides/{id}:
 *   patch:
 *     summary: Update ride
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
router.patch('/:id', validate(updateRideSchema), RideController.updateRide);

/**
 * @swagger
 * /rides/{id}:
 *   delete:
 *     summary: Delete ride
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       204:
 *         description: Ride deleted successfully
 *       404:
 *         description: Ride not found
 */
router.delete('/:id', RideController.deleteRide);

export default router;