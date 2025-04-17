//server/src/routes/vehicle.routes.js
import express from 'express';
import VehicleController from '../controllers/vehicle.controller.js';
import { vehicleSchema, updateVehicleSchema } from '../validations/vehicle.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       required:
 *         - vehicleRegistrationNo
 *         - vehicleMake
 *         - vehicleModel
 *         - vehicleYear
 *         - driverId
 *       properties:
 *         vehicleRegistrationNo:
 *           type: string
 *         vehicleMake:
 *           type: string
 *         vehicleModel:
 *           type: string
 *         vehicleYear:
 *           type: integer
 *         vehicleColor:
 *           type: string
 *         vehicleType:
 *           type: string
 *           enum: [sedan, suv, truck, van, motorcycle]
 *         vehicleCapacity:
 *           type: integer
 *         vehicleFuelType:
 *           type: string
 *           enum: [gasoline, diesel, electric, hybrid]
 *         driverId:
 *           type: string
 *         insuranceStatus:
 *           type: boolean
 */

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle management endpoints
 */

router.use(protect);
router.use(restrictTo('driver'));

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Register new vehicle (Driver only)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Vehicle registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       400:
 *         description: Validation error
 */
router.post('/', validate(vehicleSchema), VehicleController.AddVehicleDtl);

/**
 * @swagger
 * /vehicles/{id}:
 *   patch:
 *     summary: Update vehicle details (Driver only)
 *     tags: [Vehicles]
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
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       404:
 *         description: Vehicle not found
 */
router.patch('/:id', validate(updateVehicleSchema), VehicleController.updateDetails);

router.use(restrictTo('admin'));

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles (Admin only)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */
router.get('/', VehicleController.ShowAllVehicle);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID (Admin only)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', VehicleController.ShowAVehicle);

export default router;