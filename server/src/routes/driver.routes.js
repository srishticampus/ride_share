//server/src/routes/driver.routes.js
import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
import * as driverValidation from '../validations/driver.validation.js';
import { validate } from '../middlewares/validation.middleware.js';
import { uploadDriverPhoto } from '../middlewares/upload.middleware.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Driver:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullName
 *         - phoneNumber
 *         - licenseNumber
 *       properties:
 *         id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         email:
 *           type: string
 *           format: email
 *           example: driver@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *         fullName:
 *           type: string
 *           example: John Doe
 *         phoneNumber:
 *           type: string
 *           example: "+1234567890"
 *         licenseNumber:
 *           type: string
 *           example: "DL12345678901234"
 *         driverPic:
 *           type: string
 *           example: "uploads/driver-pics/driver-123.jpg"
 *         vehicleRegNumber:
 *           type: string
 *           example: "ABC123"
 *         backgroundCheck:
 *           type: boolean
 *           default: false
 *         status:
 *           type: boolean
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         message:
 *           type: string
 *           example: "Error message"
 */

/**
 * @swagger
 * tags:
 *   name: Drivers
 *   description: Driver management endpoints
 */

/**
 * @swagger
 * /drivers/register:
 *   post:
 *     summary: Register a new driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - phoneNumber
 *               - licenseNumber
 *               - vehicleRegNumber
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               vehicleRegNumber:
 *                 type: string
 *               driverPic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Driver registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/register',
  uploadDriverPhoto,
  validate(driverValidation.driverRegistrationSchema),
  driverController.DriverRegistration
);

/**
 * @swagger
 * /drivers/login:
 *   post:
 *     summary: Authenticate driver
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/login',
  validate(driverValidation.driverLoginSchema),
  driverController.login
);

// Protected routes (require authentication)
router.use(protect);

/**
 * @swagger
 * /drivers/me:
 *   get:
 *     summary: Get current driver's profile
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current driver's profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 */
router.get('/me', driverController.getCurrentDriver);

/**
 * @swagger
 * /drivers/me/update:
 *   patch:
 *     summary: Update current driver's profile
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               driverPic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 */
router.patch(
  '/me/update',
  uploadDriverPhoto,
  validate(driverValidation.updateDriverSchema),
  driverController.updateCurrentDriver
);

/**
 * @swagger
 * /drivers/findByDriverPh:
 *   post:
 *     summary: Find driver by phone number
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Driver found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Phone number is required
 *       404:
 *         description: No driver found with this phone number
 */
router.post(
  '/findByDriverPh',
  validate(driverValidation.findByPhoneSchema),
  driverController.FindByPhonenumber
);

/**
 * @swagger
 * /drivers/forgotPass/{phoneNumber}:
 *   post:
 *     summary: Reset driver's password
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       400:
 *         description: Phone number is required
 *       404:
 *         description: No driver found with this phone number
 */
router.post(
  '/forgotPass/:phoneNumber',
  validate(driverValidation.forgotPasswordSchema),
  driverController.ForgotPassword
);

// Admin-only routes
router.use(restrictTo('admin'));

/**
 * @swagger
 * /drivers/{id}/approve:
 *   patch:
 *     summary: Approve driver (Admin only)
 *     tags: [Drivers]
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
 *         description: Driver approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 */
router.patch('/:id/approve', driverController.ApproveDriver);

/**
 * @swagger
 * /drivers/showAllDrivers:
 *   get:
 *     summary: Get all drivers (Admin only)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 results:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 */
router.get('/showAllDrivers', driverController.viewDrivers);

/**
 * @swagger
 * /drivers/{id}:
 *   get:
 *     summary: Get driver by ID (Admin only)
 *     tags: [Drivers]
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
 *         description: Driver details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 */
router.get('/:id', driverController.viewADriver);

/**
 * @swagger
 * /drivers/{id}/deactivate:
 *   patch:
 *     summary: Deactivate driver (Admin only)
 *     tags: [Drivers]
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
 *         description: Driver deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 */
router.patch('/:id/deactivate', driverController.DeactivateDriver);

/**
 * @swagger
 * /drivers/{id}/activate:
 *   patch:
 *     summary: Activate driver (Admin only)
 *     tags: [Drivers]
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
 *         description: Driver activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Driver'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 */
router.patch('/:id/activate', driverController.ActivateDriver);

export default router;