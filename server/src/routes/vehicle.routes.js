//server/src/routes/vehicle.routes.js
import express from 'express';
import VehicleController from '../controllers/vehicle.controller.js';
import { vehicleSchema, updateVehicleSchema } from '../validations/vehicle.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import {protect,restrictTo} from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Vehicle management
 */

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
 *         - vehicleType
 *         - vehicleCapacity
 *         - vehicleFuelType
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
 * /vehicles/vehicledetails:
 *   post:
 *     summary: Add vehicle details
 *     tags: [Vehicle]
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
 *         description: Vehicle created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/vehicledetails',
  protect,
  restrictTo('driver'),
  validate(vehicleSchema),
  VehicleController.AddVehicleDtl
);

/**
 * @swagger
 * /vehicles/editvehicle/{id}:
 *   patch:
 *     summary: Update vehicle details
 *     tags: [Vehicle]
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
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       404:
 *         description: Vehicle not found
 */
router.patch(
  '/editvehicle/:id',
  protect,
  restrictTo('driver'),
  validate(updateVehicleSchema),
  VehicleController.updateDetails
);

/**
 * @swagger
 * /vehicles/showAllVehicle:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */
router.get(
  '/showAllVehicle',
  protect,
  VehicleController.ShowAllVehicle
);

/**
 * @swagger
 * /vehicles/showAVehicle/{id}:
 *   get:
 *     summary: Get a single vehicle
 *     tags: [Vehicle]
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
 *         description: Vehicle data
 *       404:
 *         description: Vehicle not found
 */
router.get(
  '/showAVehicle/:id',
  protect,
  VehicleController.ShowAVehicle
);

export default router;